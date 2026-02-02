
import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";

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
    return res.json({
      status: "success",
      payload: req.user,
    });
  }
);

export default router;
