import { t, UnwrapSchema } from "elysia"

export const transactionModel = {
    addResult: t.Object({

    }),

    pagination: t.Object({
        limit: t.Number({ maximum: 32, default: 16, error: "Maximum of shown data is 32 and 16 is minimum" }),
        page: t.Number({ default: 1, minimum: 1, error: "Should start from 1" })
    })
}

export type TTransaction = {
    [b in keyof typeof transactionModel]: UnwrapSchema<typeof transactionModel[b]>;
}