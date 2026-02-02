// src/config/passport.config.js

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { UserModel } from "../dao/models/user.model.js";
import { isValidPassword, createHash } from "../utils/bcrypt.js";
import { cartModel } from "../dao/models/cartModel.js";

export const initializePassport = () => {

  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age } = req.body;

          if (!first_name || !last_name || age === undefined || !password) {
            return done(null, false, { message: "Faltan campos obligatorios" });
          }

          const normalizedEmail = email.toLowerCase().trim();

          const exists = await UserModel.findOne({ email: normalizedEmail });
          if (exists) return done(null, false, { message: "El email ya está registrado" });


          const newCart = await cartModel.create({});
          const isAdmin = normalizedEmail === process.env.ADMIN_EMAIL;
          const user = await UserModel.create({
            first_name,
            last_name,
            email: normalizedEmail,
            age: Number(age),
            password: createHash(password),
            cart: newCart._id,
            role: isAdmin ? "admin" : "user",
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );


  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const normalizedEmail = email.toLowerCase().trim();

        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) return done(null, false, { message: "Credenciales inválidas" });

        if (!isValidPassword(user, password)) {
          return done(null, false, { message: "Credenciales inválidas" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );


  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await UserModel.findById(jwtPayload.id).populate("cart");
          if (!user) return done(null, false, { message: "Token válido pero usuario inexistente" });


          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
