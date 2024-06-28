import { z } from "zod";
import { listType } from "./listType";

export const boardSchema = z.object({
  name: z.string().min(1, "This field is required"),
  list: listType,
});
