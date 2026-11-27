import { t, UnwrapSchema } from "elysia"
import { ObjectId } from "mongodb"

export const transactionSchema = {
    data: t.Object({
        created_at: t.Date({ error: "Invalid datetime" }),
        drugs: t.Array(t.Object({
            _id: t.Transform(
                t.String({ error: "Drug in cart is invalid", pattern: "^[0-9A-Fa-f]{24}$" }))
                .Decode((id) => new ObjectId(id)).Encode((id) => id.toHexString()
            ),
            created_at: t.Date({ error: "Invalid datetime" }),
            image: t.String({ error: "Unable to access file" }),
            image_filename: t.String({ error: "Invalid file name" }),
            image_filetype: t.String({ error: "Invalid file type" }),
            image_public_id: t.String({ error: "Invalid file" }),
            image_resource_type:  t.String({ error: "failed to get file" }),
            name: t.String({ error: "Invalid drug name" }),
            price: t.Number({ error: "Invalid drug price" }),
            quantity: t.Number({ error: "Invalid drug quantity" }),
            updated_at: t.Date({ error: "Invalid datetime" }),
            drug_id: t.Transform(
                t.String({ error: "invalid drug data", pattern: "^[0-9A-Fa-f]{24}$" }))
                .Decode((id) => new ObjectId(id)).Encode((id) => id.toHexString()
            )
        })),
        price_total: t.Number({ error: "Invalid price total" })
    }),

    pagination: t.Object({
        limit: t.Number({ maximum: 32, default: 16, error: "Maximum of shown data is 32 and 16 is minimum" }),
        page: t.Number({ default: 1, minimum: 1, error: "Should start from 1" })
    }),

    params: t.Object({
        _id: t.String({ error: "Invalid transaction data", pattern: "^[0-9A-Fa-f]{24}$" })
    })
}

export type TTransaction = {
    [b in keyof typeof transactionSchema]: UnwrapSchema<typeof transactionSchema[b]>;
}