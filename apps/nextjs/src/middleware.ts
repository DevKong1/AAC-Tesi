import { NextResponse, type NextRequest } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (token) {
    return await authenticateRequest(token);
  } else {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Authentication failed: No token given",
      }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }
}

async function authenticateRequest(token: string) {
  try {
    const JWKS = createRemoteJWKSet(new URL(process.env.CLERK_JWT_URL!));

    // Verify the given token
    const { payload } = await jwtVerify(token.replace("Bearer ", ""), JWKS);
    const response = NextResponse.next();
    // Set a cookie to pass user ID
    response.cookies.set("user", payload.sub ? payload.sub : "");
    // Response will have a `Set-Cookie:show-banner=false;path=/home` header
    return response;
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Authentication failed: Token could not be verified",
      },
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }
}

export const config = {
  matcher: "/api/:function*",
};
