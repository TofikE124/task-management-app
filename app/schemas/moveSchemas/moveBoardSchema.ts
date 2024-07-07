import { z } from "zod";

export const moveBoardSchema = z.object({
  beforeId: z.string().min(1, "This field is required"),
});
