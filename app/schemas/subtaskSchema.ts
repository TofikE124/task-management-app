import { v4 } from "uuid";
import { z } from "zod";

export const subtaskSchema = z.object({
  id: z.string().optional().default(v4()),
  title: z.string().min(1, "This field is required"),
  checked: z.boolean().default(false),
});
