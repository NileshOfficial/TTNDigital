import mongoose, { Schema } from "mongoose";
import { Department } from "./department.model";

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

export default mongoose.model<Department>("department", departmentSchema);