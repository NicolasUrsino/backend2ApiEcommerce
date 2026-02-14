// src/dao/models/user.model.js
import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true, trim: true },
        last_name: { type: String, required: true, trim: true },

        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },

        age: { type: Number, required: true, min: 0 },

        password: { type: String, required: true },


        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts",
            default: null,
        },
        resetToken: { type: String },
        resetTokenExpires: { type: Date },

        role: { type: String, default: "user" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const UserModel = mongoose.model(userCollection, userSchema);
