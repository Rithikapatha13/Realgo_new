import { z } from "zod";

export const GreetingsValidation = z.object({
    file_category: z.string().min(1, "File category is required"),
    file_name: z.string().optional(),
    file: z.any().optional(),
    company_id: z.string().optional(),

    schedule_later: z.boolean().default(false),
    scheduled_at: z.date().optional(),
});
