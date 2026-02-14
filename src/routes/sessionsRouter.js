
import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import UserDTO from "../dto/user.dto.js";

const router = Router();

//api/sessions/register
router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  (req, res) => {

    const token = generateToken(req.user);

    return res.status(201).json({
      status: "success",
      payload: req.user, 
      token,
    });
  }
);

//api/sessions/login
router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);

    return res.json({
      status: "success",
      token,
      payload: req.user,
    });
  }
);

//api/sessions/current
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({ status: "success", payload: userDTO });
  }
);
router.post("/forgot-password", async (req, res) => {
  try {
    const result = await usersService.requestPasswordReset(
      req.body.email,
      mailService
    );

    res.json({ status: "success", payload: result });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const result = await usersService.resetPassword(token, newPassword);

    res.json({ status: "success", payload: result });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

export default router;
