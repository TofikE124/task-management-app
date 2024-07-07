import { z } from "zod";
import { taskSchema } from "./taskSchema";
import { v4 } from "uuid";

export const columnSchema = z.object({
  id: z.string().optional().default(v4()),
  title: z.string().min(1, "This field is required"),
  tasks: z.array(taskSchema).optional().default([]),
  boardId: z.string().optional(),
  color: z.string().optional().default("#fff"),
});
