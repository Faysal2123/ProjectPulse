import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secretkey";

export function signJWT(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
