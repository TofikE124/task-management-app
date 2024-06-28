import { z } from "zod";

export const itemSchema = z.object({
  id: z.string().min(1, "This field is required"),
  value: z.string().min(1, "This field is required"),
});

export const listType = z.array(itemSchema);
