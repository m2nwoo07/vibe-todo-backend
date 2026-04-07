import mongoose from "mongoose";
import { todoSchema } from "./todoSchema.js";

export const Todo = mongoose.model("Todo", todoSchema);
