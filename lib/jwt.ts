import jwt from "jsonwebtoken";

const signJwtToken = (payload: { id: string }) => {
  const accessToken = jwt.sign(payload, String(process.env.JWT_SECRET), { expiresIn: process.env.JWT_EXPIRESIN });
  return accessToken;
};

const verifyJwtToken = (accessToken: string) => {
  const decodedAccessToken = jwt.verify(accessToken, String(process.env.JWT_SECRET));
  return decodedAccessToken;
};

export { signJwtToken, verifyJwtToken };
