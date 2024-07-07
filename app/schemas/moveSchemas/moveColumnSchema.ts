import { z } from "zod";

export const moveColumnSchema = z.object({
  boardId: z.string().min(1, "This field is required"),
  beforeId: z.string().min(1, "This field is required"),
});
