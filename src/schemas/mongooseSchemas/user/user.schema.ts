import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    picture: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        immutable: true,
    },

    dob: {
        type: Number,
    },

    contact: {
        type: String,
        validate: {
            validator: function (v) {
                var re = /^\d{10}$/;
                return v == null || v.trim().length < 1 || re.test(v);
            },
            message: "Provided phone number is invalid.",
        }
    },

    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "su"],
    },

    department: {
        type: String,
    },
});

export default mongoose.model<User>('users', userSchema);