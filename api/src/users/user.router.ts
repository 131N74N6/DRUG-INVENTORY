import Elysia, { t } from "elysia";
import { userSchema } from "./user.model";
import userController from "./user.controller";
import { authMiddleware } from "../auths/auth.middleware";
import { DrugStoreApiError } from "../error/error.service";

const userRouters = new Elysia({ prefix: "/api/v1/users" })
.use(authMiddleware)
.delete("/", async () => {
    return await userController.deleteAllUsers();
}, {
    auth: true,
    role: ["admin"]
})
.delete("/:_id", async ({ params }) => {
    return await userController.deleteOneUser(params._id);
}, {
    auth: true,
    params: userSchema.params,
    role: ["admin"]
})
.get("/me", async ({ user }) => {
    if (!user) throw new DrugStoreApiError(401, "Unauthorized");
    return await userController.showUserById(user.id);
}, {
    auth: true
})
.get("/", async ({ query }) => {
    return await userController.showAllUsers(query);
}, {
    auth: true,
    query: userSchema.pagination,
    role: ["admin"]
})
.get("/:_id", async ({ params }) => {
    return await userController.showUserById(params._id);
}, {
    auth: true,
    params: userSchema.params
})
.put("/", async ({ body }) => {
    return await userController.changeOneUser(body);
}, {
    auth: true,
    body: userSchema.changeRaw
});

export default userRouters;