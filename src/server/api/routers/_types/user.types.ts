// Jwt payload to get the userId
export type JwtPayloadProp = {
  userId: string;
};

export type UserIPProps = {
  userId: string;
  hashedIP: string;
}