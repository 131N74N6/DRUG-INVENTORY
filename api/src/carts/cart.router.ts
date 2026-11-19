import Elysia from "elysia";
import CartController from "./cart.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { cartSchema } from "./cart.model";

const cartRouters = new Elysia({ prefix: "/api/v1/carts" })
.use(authMiddleware)
.delete("/", async () => {
    return await new CartController().deleteAllDrugsInCart();
}, {
    auth: true,
    role: ["cashier"]
})
.delete("/:_id", async ({ params }) => {
    return await new CartController().deleteOneDrugFromCart(params._id);
}, {
    auth: true,
    params: cartSchema.params,
    role: ["cashier"]
})
.get("/", async ({ query }) => {
    return await new CartController().showAllDrugsInCart(query);
}, {
    auth: true,
    query: cartSchema.pagination,
    role: ["cashier"]
})
.put("/", async ({ body }) => {
    return await new CartController().changeOneDrugInCart(body)
}, {
    auth: true,
    body: cartSchema.changeResult,
    role: ["cashier"]
});

export default cartRouters;