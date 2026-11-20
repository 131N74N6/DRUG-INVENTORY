import Elysia from "elysia";
import TransactionController from "./transaction.controller";
import { authMiddleware } from "../auths/auth.middleware";
import { transactionSchema } from "./transaction.model";

const transactionRouters = new Elysia({ prefix: "/api/v1/transactions" })
.use(authMiddleware)
.delete("/", async () => {
    return await new TransactionController().deleteAllTransactions();
}, {
    auth: true,
    role: ["admin", "cashier"]
})
.delete("/:_id", async ({ params }) => {
    return await new TransactionController().deleteOneTransaction(params._id);
}, {
    auth: true,
    params: transactionSchema.params,
    role: ["admin", "cashier"]
})
.get("/", async ({ query }) => {
    return await new TransactionController().showAllTransactions(query);
}, {
    auth: true,
    query: transactionSchema.pagination
})
.get("/:_id", async ({ params }) => {
    return await new TransactionController().showTransactionDetail(params._id);
}, {
    auth: true,
    query: transactionSchema.params
});

export default transactionRouters;