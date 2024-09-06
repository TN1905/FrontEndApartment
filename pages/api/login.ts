import type { NextApiRequest, NextApiResponse } from "next";
import { loginPage } from "../../lib/auth";
import { login } from "../../api/users/getLoginData";
import { getSessionAccount } from "../../api/sessionAccount/getSession";
import { updateSessionAccount } from "../../api/sessionAccount/updateSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      const user = await login(email, password); // Thực hiện xác thực

      if (user) {
        const getSessionData = await getSessionAccount(user.id);

        let session, expires;
        if (getSessionData) {
          const updatedSession = await loginPage(user);
          session = updatedSession.session;
          expires = updatedSession.expires;
          await updateSessionAccount(user.id, session, expires);
        } else {
          // Tạo mới session
          const newSession = await loginPage(user);
          session = newSession.session;
          expires = newSession.expires;
          await updateSessionAccount(user.id, session, expires); // Lưu session mới vào database
        }

        res.status(200).json({
          success: true,
          user,
          session,
          expires,
        });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
