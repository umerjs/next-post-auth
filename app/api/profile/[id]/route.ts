import { UserModel } from "@/models/User";
import { authGuardJWT } from "@/utils/authGuard";
import { NextRequest, NextResponse } from "next/server";
import { connectdb } from "@/libs/db";
type RouteContext = {
  params: Promise<{ id: string }>;
};
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await authGuardJWT(request);
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 },
      );
    }

    const userId = id;

    await connectdb();

    const profile = await UserModel.findById(userId);

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile fetched successfully", profile },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
