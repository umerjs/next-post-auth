import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectdb } from "@/libs/db";
import { UserModel } from "@/models/User";
import { emailPattern } from "@/utils/regex";

export async function POST(request: Request) {
  try {
    await connectdb();
    const body = await request.json();

    const { email, password } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is Required" },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Password is Required" },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Email is not valid" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase();

    const user = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 400 },
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 400 },
      );
    }

    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "15d",
      },
    );

    return NextResponse.json({
      message: "Done",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
