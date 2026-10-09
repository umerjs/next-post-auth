import { UserModel } from "@/models/User";
import { authGuardJWT } from "@/utils/authGuard";
import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/libs/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET: Fetch user profile by ID
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }

    await connectdb();
    const profile = await UserModel.findById(id).select("-password").lean();

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT: Update user profile by ID
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const authResult = await authGuardJWT(request);
    if ("error" in authResult || !authResult.userId) {
      return (
        authResult.error ||
        NextResponse.json({ message: "Unauthorized" }, { status: 401 })
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { firstname, lastname, username } = body;

    await connectdb();

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(firstname && { firstname }),
          ...(lastname && { lastname }),
          ...(username && { username }),
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedUser,
    });
  } catch (error) {
    console.error("PUT Profile Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
