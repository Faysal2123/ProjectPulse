import { NextApiRequest, NextApiResponse } from "next";
import { verifyJWT } from "./auth"; // <-- matches your auth.ts

export function withRole(roles: string[]) {
  return (handler: Function) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = verifyJWT(token); // <-- fixed typo

        if (!roles.includes(decoded.role)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        // Attach user info to request
        req.body.user = decoded;

        return handler(req, res);
      } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
    };
}
