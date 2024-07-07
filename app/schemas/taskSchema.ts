import { z } from "zod";
import { subtaskSchema } from "./subtaskSchema";
import { v4 } from "uuid";

export const taskSchema = z.object({
  id: z.string().optional().default(v4()),
  title: z.string().min(1, "This field is required"),
  description: z.string().min(1, "This field is required"),
  subtasks: z.array(subtaskSchema).optional().default([]),
  columnId: z.string().min(1, "This field is required"),
});
