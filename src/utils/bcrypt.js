
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createHash = (password) => {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password inválida");
  }
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
};

export const isValidPassword = (user, plainPassword) => {
  if (!user?.password) return false;
  if (typeof plainPassword !== "string" || plainPassword.length === 0) return false;
  return bcrypt.compareSync(plainPassword, user.password);
};
