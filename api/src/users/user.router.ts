import Elysia, { t } from "elysia";
import { userSchema } from "./user.model";
import UserController from "./user.controller";
import { authMiddleware } from "../auths/auth.middleware";
import { DrugStoreApiError } from "../error/error.service";

const userRouters = new Elysia({ prefix: "/api/v1/users" })
.use(authMiddleware)
.delete("/", async () => {
    return await new UserController().deleteAllUsers();
}, {
    auth: true,
    role: ["admin"]
})
.delete("/:_id", async ({ params }) => {
    return await new UserController().deleteOneUser(params._id);
}, {
    auth: true,
    params: userSchema.params,
    role: ["admin"]
})
.get("/me", async ({ user }) => {
    if (!user) throw new DrugStoreApiError(401, "Unauthorized");
    return await new UserController().showUserById(user.id);
}, {
    auth: true
})
.get("/", async ({ query }) => {
    return await new UserController().showAllUsers(query);
}, {
    auth: true,
    query: userSchema.pagination,
    role: ["admin"]
})
.get("/:_id", async ({ params }) => {
    return await new UserController().showUserById(params._id);
}, {
    auth: true,
    params: userSchema.params
})
.post("/", async ({ body }) => {
    return await new UserController().addOneUser(body);
}, {
    auth: true,
    body: userSchema.addRaw,
    role: ["admin"]
})
.put("/", async ({ body }) => {
    return await new UserController().changeOneUser(body);
}, {
    auth: true,
    body: userSchema.changeRaw,
    role: ["admin"]
});

export default userRouters;