import { t, UnwrapSchema } from "elysia"
import { ObjectId } from "mongodb"

export const cartSchema = {
    addResult: t.Object({
        image: t.String({ error: "Unable to access file" }),
        image_filename: t.String({ error: "Invalid file name" }),
        image_filetype: t.String({ error: "Invalid file type" }),
        image_public_id: t.String({ error: "Invalid file" }),
        image_resource_type:  t.String({ error: "failed to get file" }),
        name: t.String({ error: "Invalid drug name" }),
        price: t.Number({ error: "Invalid drug price" }),
        quantity: t.Number({ error: "Invalid drug quantity" }),
        drug_id: t.String({ error: "Invalid drug data", pattern: "^[0-9A-Fa-f]{24}$" })
    }),

    changeResult: t.Object({
        _id: t.String({ error: "Invalid drug data" }),
        quantity: t.Number({ error: "Invalid drug quantity" })
    }),

    changeStock: t.Object({
        drug_id: t.String({ error: "Invalid drug data", pattern: "^[0-9A-Fa-f]{24}$" }),
        quantity: t.Number({ error: "Invalid drug quantity" })
    }),
    
    data: t.Object({
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
            t.String({ error: "invalid user", pattern: "^[0-9A-Fa-f]{24}$" }))
            .Decode((id) => new ObjectId(id)).Encode((id) => id.toHexString()
        )
    }),

    drugs: t.Object({
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
    }),

    pagination: t.Object({
        limit: t.Number({ maximum: 32, default: 16, error: "Maximum of shown data is 32 and 16 is minimum" }),
        page: t.Number({ default: 1, minimum: 1, error: "Should start from 1" })
    }),

    params: t.Object({
        _id: t.String({ error: "Invalid drug data", pattern: "^[0-9A-Fa-f]{24}$" })
    })
}

export type TCart = {
    [b in keyof typeof cartSchema]: UnwrapSchema<typeof cartSchema[b]>;
}