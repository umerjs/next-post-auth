import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function authGuardJWT(req: NextRequest) {
  try {
    const token = req.headers.get("token");

    if (!token) {
      return {
        error: new Response(JSON.stringify({ message: "Unauthorized" }), {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      };
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as {
      _id: string;
    };

    return {
      userId: decodedToken._id,
    };
  } catch (error) {
    console.error(error);

    return {
      error: new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    };
  }
}
