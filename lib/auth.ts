import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { updateSessionAccount } from "../api/sessionAccount/updateSession";


const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);



export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // Đặt thời gian hết hạn là 1 giờ
    .sign(key);
}

export function generateSessionToken() {
  return randomBytes(64).toString("hex");
}

export async function updateSession(user: any) {
  const session = generateSessionToken(); // Sinh token mới
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Thời gian hết hạn là 30 ngày

  // Lưu session vào database hoặc nơi lưu trữ bạn đang sử dụng
  await updateSessionAccount(user.id, session, expires.getTime()); // Thay đổi expires thành timestamp

  return { session, expires: expires.getTime() }; // Trả về expires dưới dạng timestamp
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function loginPage(user: any) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 10 phút
  const session = await encrypt({ user, expires });

  return {
    session,
    expires: expires.getTime(), // Trả về expires dưới dạng timestamp
  };
}

export async function logout() {
  return {
    session: "",
    expires: new Date(0),
  };
}

export async function getSession(cookie: string) {
  if (!cookie) return null;
  return await decrypt(cookie);
}
