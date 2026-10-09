import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectdb } from "@/libs/db";
import { UserModel } from "@/models/User";
import { emailPattern, passwordPattern } from "@/utils/regex";

export async function POST(request: Request) {
  try {
    await connectdb();
    const body = await request.json();

    const { firstname, lastname, email, password, username } = body;

    if (!firstname) {
      return NextResponse.json(
        { message: "First Name is Required" },
        { status: 400 },
      );
    }

    if (!lastname) {
      return NextResponse.json(
        { message: "Last Name is Required" },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Password is Required" },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is Required" },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Email is not valid" },
        { status: 400 },
      );
    }

    if (!passwordPattern.test(password)) {
      return NextResponse.json(
        { message: "Password is not enough Secure" },
        { status: 400 },
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const normalizedEmail = email.toLowerCase();

    const user = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (user) {
      return NextResponse.json(
        { message: "Email already taken" },
        { status: 400 },
      );
    }

    const normalizedUsername = username?.trim();

    if (!normalizedUsername) {
      return NextResponse.json(
        { message: "Username is Required" },
        { status: 400 },
      );
    }

    const existingUsername = await UserModel.findOne({
      username: normalizedUsername,
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 },
      );
    }

    const newUser = await UserModel.create({
      firstname,
      lastname,
      email: normalizedEmail,
      password: passwordHash,
      username: normalizedUsername,
    });

    const token = jwt.sign(
      {
        email: newUser.email,
        _id: newUser._id,
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
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        username: newUser.username,
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
