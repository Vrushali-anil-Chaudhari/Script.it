import { z } from 'zod'

export const LoginSchema = z.object({
    username: z.string().min(4, {
        message: "Username must be atleast of 4 characters",
    }),
    first_name: z.string().min(4, {
        message: "first_name must be atleast of 3 characters",
    }),
    last_name: z.string().min(4, {
        message: "last_name must be atleast of 4 characters",
    }),
    email: z.string().email({
        message: "Invalid Email"
    }),
    password: z.string().min(4, {
        message: "Password must be atleast of 4 characters",
    }).max(30, {
        message: "Max Length Password exceeded"
    }),
    password2: z.string().min(4, {
        message: "Password must be atleast of 4 characters",
    }).max(30, {
        message: "Max Length Password exceeded"
    })
}).refine((data) => data.password === data.password2, {
    message: "Password don't Match",
    path: ["password2"]
});

export const SigninSchema = z.object({
    username: z.string().min(4, {
        message: "Username must be atleast of 4 characters",
    }),
    password: z.string().min(4, {
        message: "Password must be atleast of 4 characters",
    }).max(30, {
        message: "Max Length Password exceeded"
    })
})