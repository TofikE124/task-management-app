import { z } from "zod";

export const checkSubtaskSchema = z.object({
  checked: z.boolean().refine((val) => val === true || val === false, {
    message: "This field is required",
  }),
});
