import { t, UnwrapSchema } from "elysia"

export const transactionModel = {
    addResult: t.Object({
        image: t.String({ error: "Unable to access file" }),
        image_filename: t.String({ error: "Invalid file name" }),
        image_filetype: t.String({ error: "Invalid file type" }),
        image_public_id: t.String({ error: "Invalid file" }),
        image_resource_type:  t.String({ error: "failed to get file" }),
        name: t.String({ error: "Invalid drug name" }),
        price: t.Number({ error: "Invalid drug price" }),
        stock: t.Number({ error: "Invalid drug price" })
    }),

    changeResult: t.Object({
        _id: t.String({ error: "Invalid transaction data" }),
        price: t.Number({ error: "Invalid drug price" }),
        stock: t.Number({ error: "Invalid drug price" })
    }),

    pagination: t.Object({
        limit: t.Number({ maximum: 32, default: 16, error: "Maximum of shown data is 32 and 16 is minimum" }),
        page: t.Number({ default: 1, minimum: 1, error: "Should start from 1" })
    }),

    params: t.Object({
        _id: t.String({ error: "Invalid transaction data" })
    })
}

export type TTransaction = {
    [b in keyof typeof transactionModel]: UnwrapSchema<typeof transactionModel[b]>;
}