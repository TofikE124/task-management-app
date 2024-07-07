import { z } from "zod";
import { columnSchema } from "./columnSchema";
import { v4 } from "uuid";

export const boardSchema = z.object({
  id: z.string().optional().default(v4()),
  title: z.string().min(1, "This field is required"),
  columns: z.array(columnSchema).optional().default([]),
});
