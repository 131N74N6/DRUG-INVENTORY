import Elysia from "elysia";
import { authMiddleware } from "../auths/auth.middleware";
import drugController from "./drug.controller";
import { drugSchema } from "./drug.model";

const drugRouters = new Elysia({ prefix: "/api/v1/drugs" })
.use(authMiddleware)
.delete("/", async () => {
    return await drugController.deleteAllDrugs();
}, {
    auth: true,
    role: ["admin", "pharmacist"]
})
.delete("/:_id", async ({ params }) => {
    return await drugController.deleteOneDrug(params._id);
}, {
    auth: true,
    role: ["admin", "pharmacist"],
    params: drugSchema.params
})
.get("/empty", async ({ query }) => {
    return await drugController.showEmptyDrugs(query);
}, {
    auth: true,
    query: drugSchema.pagination
})
.get("/", async ({ query }) => {
    return await drugController.showAvailableDrugs(query);
}, {
    auth: true,
    query: drugSchema.pagination
})
.get("/:_id", async ({ params }) => {
    return await drugController.showDrugDetail(params._id);
}, {
    auth: true,
    params: drugSchema.params
})
.post("/", async ({ body }) => {
    return await drugController.addOneDrug(body);
}, {
    auth: true,
    body: drugSchema.addRaw,
    role: ["admin", "pharmacist"]
})
.put("/", async ({ body }) => {
    return await drugController.changeOneDrug(body);
}, {
    auth: true,
    body: drugSchema.changeRaw,
    role: ["admin", "pharmacist"]
});

export default drugRouters;