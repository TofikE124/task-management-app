import { z } from "zod";
import { listType } from "./listType";

export const taskSchema = z.object({
  title: z.string().min(1, "This field is required"),
  description: z.string().min(1, "This field is required"),
  list: listType,
  status: z.string().min(1, "This field is required"),
});
