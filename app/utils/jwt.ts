import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET as string;

/**
 * 生成 JWT Token 的函数。
 * @param payload - 包含用户信息的载荷。
 * @returns 生成的 JWT Token。
 */
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secretKey);
};
