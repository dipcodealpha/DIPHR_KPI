import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  createAccessCookieValue,
  getAccessCookieOptions,
  isValidAccessPassword
} from "@/lib/access";

interface AccessRequestBody {
  password?: string;
  redirectTo?: string;
}

function normalizeRedirectPath(input?: string) {
  if (!input || !input.startsWith("/")) {
    return "/dashboard";
  }

  if (input.startsWith("/access") || input.startsWith("/api")) {
    return "/dashboard";
  }

  return input;
}

export async function POST(request: Request) {
  const body = (await request.json()) as AccessRequestBody;
  const password = body.password?.trim() || "";
  const redirectTo = normalizeRedirectPath(body.redirectTo);

  if (!password) {
    return NextResponse.json(
      {
        ok: false,
        message: "비밀번호를 입력해주세요."
      },
      { status: 400 }
    );
  }

  if (!isValidAccessPassword(password)) {
    return NextResponse.json(
      {
        ok: false,
        message: "비밀번호가 올바르지 않습니다."
      },
      { status: 401 }
    );
  }

  const cookieValue = await createAccessCookieValue();
  const response = NextResponse.json({
    ok: true,
    redirectTo
  });

  response.cookies.set(
    ACCESS_COOKIE_NAME,
    cookieValue,
    getAccessCookieOptions()
  );

  return response;
}