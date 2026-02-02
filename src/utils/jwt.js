
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    id: user._id?.toString?.() ?? user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};
