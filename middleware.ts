    import jwt from "jsonwebtoken";
    import { NextRequest, NextResponse } from "next/server";
    import { UserModel } from "@/models/User";

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
        
        const JWTKEY = process.env.JWT_KEY;
        
        if (!JWTKEY) {
            throw new Error("JWT_KEY is not defined");
        }
        
        const decodedToken = jwt.verify(token, JWTKEY) as {
            _id: string;
        };
        return NextResponse.next();
        
        const currentUser = await UserModel.findById(decodedToken._id);
        
        if (!currentUser) {
            return {
            error: new Response(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            headers: {
                "Content-Type": "application/json",
            },
            }),
        };
        }

        return {
        user: currentUser,
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
