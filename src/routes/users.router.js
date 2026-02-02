
import { Router } from "express";
import passport from "passport";
import { UserModel } from "../dao/models/user.model.js";
import { authorizeRoles } from "../middlewares/authorization.js";
import { createHash } from "../utils/bcrypt.js";

const router = Router();

const authAdmin = [
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
];

//api/users (admin)
router.get("/", authAdmin, async (req, res) => {
    try {
        const users = await UserModel.find().select("-password").lean();
        return res.json({ status: "success", payload: users });
    } catch (err) {
        return res.status(500).json({ status: "error", message: "Error listando usuarios", error: err.message });
    }
});


// api/users/:uid (admin)
router.get("/:uid", authAdmin, async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await UserModel.findById(uid);
        if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        return res.json({ status: "success", payload: user });
    } catch (err) {
        return res.status(500).json({ status: "error", message: "Error obteniendo usuario", error: err.message });
    }
});

//api/users (admin) 
router.post("/", authAdmin, async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body;

        if (!first_name || !last_name || !email || age === undefined || !password) {
            return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const exists = await UserModel.findOne({ email: normalizedEmail });
        if (exists) return res.status(409).json({ status: "error", message: "El email ya está registrado" });

        const created = await UserModel.create({
            first_name,
            last_name,
            email: normalizedEmail,
            age: Number(age),
            password: createHash(password),
            cart: cart ?? null,          
            role: role ?? "user",
        });

        return res.status(201).json({ status: "success", payload: created });
    } catch (err) {
        return res.status(500).json({ status: "error", message: "Error creando usuario", error: err.message });
    }
});

//api/users/:uid (admin)
router.put("/:uid", authAdmin, async (req, res) => {
    try {
        const { uid } = req.params;

        const updates = { ...req.body };
        delete updates._id;

        if (typeof updates.password === "string" && updates.password.length > 0) {
            updates.password = createHash(updates.password);
        } else {
            delete updates.password; 
        }

        if (typeof updates.email === "string") {
            updates.email = updates.email.toLowerCase().trim();
        }

        const updated = await UserModel.findByIdAndUpdate(uid, updates, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        return res.json({ status: "success", payload: updated });
    } catch (err) {
 
        if (err?.code === 11000) {
            return res.status(409).json({ status: "error", message: "Email ya registrado" });
        }
        return res.status(500).json({ status: "error", message: "Error actualizando usuario", error: err.message });
    }
});

//api/users/:uid (admin)
router.delete("/:uid", authAdmin, async (req, res) => {
    try {
        const { uid } = req.params;

        const deleted = await UserModel.findByIdAndDelete(uid);
        if (!deleted) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        return res.json({ status: "success", payload: deleted });
    } catch (err) {
        return res.status(500).json({ status: "error", message: "Error eliminando usuario", error: err.message });
    }
});

export default router;
