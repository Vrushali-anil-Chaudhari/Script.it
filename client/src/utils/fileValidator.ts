import { z } from "zod";

export const validateFile= (file:File , MAX_SIZE:number ) => {
    const fileValidator = z
        .object({
            size: z.number().max(MAX_SIZE, { message: "File size must be less than 50MB" }),
            type: z.enum(["application/pdf"], { message: "File must be a PDF" }),
        })
        .refine(data => data.type === "application/pdf", {
            message: "File type must be PDF",
        });

    return fileValidator.safeParse({
        size: file.size,
        type: file.type,
    });
};
