import { z } from "zod";

export const columnSchema = z.object({
  title: z.string().min(1, "This field is required"),
});
