import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../lib/auth";
import { updateSessionAccount } from "../../api/sessionAccount/updateSession";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { session } = req.body;

      if (!session) {
        return res
          .status(400)
          .json({ success: false, message: "Session token is missing" });
      }

      const sessionData = await getSession(session);

      if (!sessionData) {
        return res
          .status(401)
          .json({ success: false, message: "Session expired or invalid" });
      }

      const now = Date.now();
      if (sessionData.expires < now) {
        // Tạo session mới
        const user = sessionData.user;
        const { session: newSession, expires } = await updateSessionAccount(
          user.id,
          session,
          now
        );

        // Cập nhật cookie với session mới
        res.setHeader(
          "Set-Cookie",
          `session=${newSession}; expires=${new Date(
            expires
          ).toUTCString()}; path=/`
        );

        return res
          .status(200)
          .json({ success: true, user, session: newSession, expires });
      }

      res.status(200).json({
        success: true,
        user: sessionData.user,
        session,
        expires: sessionData.expires,
      });
    } catch (error) {
      console.error("Error checking session:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
