import Elysia from "elysia";
import cartController from "./cart.controller";
import { authMiddleware } from "../auths/auth.middleware";
import { cartSchema } from "./cart.model";

const cartRouters = new Elysia({ prefix: "/api/v1/carts" })
.use(authMiddleware)
.delete("/", async () => {
    return await cartController.deleteAllDrugsInCart();
}, {
    auth: true,
    role: ["cashier"]
})
.delete("/:_id", async ({ params }) => {
    return await cartController.deleteOneDrugFromCart(params._id);
}, {
    auth: true,
    params: cartSchema.params,
    role: ["cashier"]
})
.get("/price-total", async () => {
    return await cartController.showPriceTotal();
}, {
    auth: true,
    role: ["cashier"]
})
.get("/", async ({ query }) => {
    return await cartController.showAllDrugsInCart(query);
}, {
    auth: true,
    query: cartSchema.pagination,
    role: ["cashier"]
})
.post("/transaction", async () => {
    return await cartController.addToTransaction();
}, {
    auth: true,
    role: ["cashier"]
})
.post("/", async ({ body }) => {
    return await cartController.addToCart(body);
}, {
    auth: true,
    body: cartSchema.addResult,
    role: ["cashier"]
})
.put("/", async ({ body }) => {
    return await cartController.changeOneDrugInCart(body)
}, {
    auth: true,
    body: cartSchema.changeResult,
    role: ["cashier"]
});

export default cartRouters;