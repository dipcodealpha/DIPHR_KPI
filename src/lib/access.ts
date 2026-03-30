const ACCESS_COOKIE_NAME = "app_access_token";
const ACCESS_COOKIE_PAYLOAD = "granted";

export { ACCESS_COOKIE_NAME };

function getAccessPassword() {
  const password = process.env.APP_ACCESS_PASSWORD;

  if (!password) {
    throw new Error("APP_ACCESS_PASSWORD가 설정되지 않았습니다.");
  }

  return password;
}

async function signPayload(payload: string, secret: string) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const bytes = new Uint8Array(signature);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function createAccessCookieValue() {
  const secret = getAccessPassword();
  const signature = await signPayload(ACCESS_COOKIE_PAYLOAD, secret);

  return `${ACCESS_COOKIE_PAYLOAD}.${signature}`;
}

export async function verifyAccessCookieValue(value?: string | null) {
  if (!value) {
    return false;
  }

  const expected = await createAccessCookieValue();
  return value === expected;
}

export function isValidAccessPassword(input: string) {
  const password = getAccessPassword();
  return input === password;
}

export function getAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}