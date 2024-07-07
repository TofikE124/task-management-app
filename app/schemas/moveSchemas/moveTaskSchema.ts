import { z } from "zod";

export const moveTaskSchema = z.object({
  boardId: z.string().min(1, "This field is required"),
  columnId: z.string().min(1, "This field is required"),
  newColumnId: z.string().min(1, "This field is required"),
  beforeId: z.string().min(1, "This field is required"),
});
