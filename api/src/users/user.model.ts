import { t, UnwrapSchema } from "elysia";

export const userSchema = {
    addRaw: t.Object({
        address: t.String({ error: "Invalid address", minLength: 5 }),
        email: t.String({ format: "email", error: "Invalid email" }),
        gender: t.String({ error: "Invalid gender", minLength: 4 }),
        image: t.File({ error: "Invalid file name", maxSize: 6 * 1024 * 1024, type: "image/*" }),
        password: t.String({ minLength: 8, maxLength: 72, error: "Invalid password" }),
        phone: t.String({ error: "Invalid phone number", minLength: 7 }),
        name: t.String({ minLength: 1, error: "Invalid username" }),
        role: t.String({ minLength: 1, error: "Invalid role" })
    }),

    addResult: t.Object({
        address: t.String({ error: "Invalid address", minLength: 5 }),
        email: t.String({ format: "email", error: "Invalid email" }),
        gender: t.String({ error: "Invalid gender", minLength: 4 }),
        image: t.String({ error: "Unable to access file" }),
        image_filename: t.String({ error: "Invalid file name" }),
        image_filetype: t.String({ error: "Invalid file type" }),
        image_public_id: t.String({ error: "Invalid file" }),
        image_resource_type:  t.String({ error: "failed to get file" }),
        password: t.String({ minLength: 8, maxLength: 72, error: "Invalid password" }),
        phone: t.String({ error: "Invalid phone number", minLength: 7 }),
        name: t.String({ minLength: 1, error: "Invalid username" }),
        role: t.String({ minLength: 1, error: "Invalid role" })
    }),

    changeRaw: t.Object({
        _id: t.String({ error: "Invalid data" }),
        address: t.String({ error: "Invalid address", minLength: 5 }),
        gender: t.String({ error: "Invalid gender", minLength: 4 }),
        image: t.File({ error: "Invalid file name", maxSize: 6 * 1024 * 1024, type: "image/*" }),
        phone: t.String({ error: "Invalid phone number", minLength: 7 }),
        role: t.String({ minLength: 1, error: "Invalid role" }),
        name: t.String({ minLength: 1, error: "Invalid username" })
    }),

    changeResult: t.Object({
        _id: t.String({ error: "Invalid user" }),
        address: t.String({ error: "Invalid address", minLength: 5 }),
        gender: t.String({ error: "Invalid gender", minLength: 4 }),
        image: t.String({ error: "Unable to access file" }),
        image_filename: t.String({ error: "Invalid file name" }),
        image_filetype: t.String({ error: "Invalid file type" }),
        image_public_id: t.String({ error: "Invalid file" }),
        image_resource_type:  t.String({ error: "failed to get file" }),
        phone: t.String({ error: "Invalid phone number", minLength: 7 }),
        role: t.String({ minLength: 1, error: "Invalid role" }),
        name: t.String({ minLength: 1, error: "Invalid username" })
    }),

    pagination: t.Object({
        limit: t.Number({ maximum: 30, default: 16, error: "Maximum of shown data is 30 and 16 is minimum" }),
        page: t.Number({ default: 1, minimum: 1, error: "Should start from 1" })
    }),
    
    params: t.Object({
        _id: t.String({ error: "Invalid user" })
    })
}

export type TUser = {
    [k in keyof typeof userSchema]: UnwrapSchema<typeof userSchema[k]>;
}