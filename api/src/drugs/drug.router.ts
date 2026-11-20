import Elysia from "elysia";
import { authMiddleware } from "../auths/auth.middleware";
import DrugController from "./drug.controller";
import { drugSchema } from "./drug.model";

const drugRouters = new Elysia({ prefix: "/api/v1/drugs" })
.use(authMiddleware)
.delete("/", async () => {
    return await new DrugController().deleteAllDrugs();
}, {
    auth: true,
    role: ["admin", "pharmacist"]
})
.delete("/:_id", async ({ params }) => {
    return await new DrugController().deleteOneDrug(params._id);
}, {
    auth: true,
    role: ["admin", "pharmacist"],
    params: drugSchema.params
})
.get("/", async ({ query }) => {
    return await new DrugController().showAllDrugs(query);
}, {
    auth: true,
    query: drugSchema.pagination
})
.get("/:_id", async ({ params }) => {
    return await new DrugController().showDrugDetail(params._id);
}, {
    auth: true,
    role: ["admin", "pharmacist"],
    params: drugSchema.params
})
.put("/", async ({ body }) => {
    return await new DrugController().changeOneDrug(body);
}, {
    auth: true,
    body: drugSchema.changeRaw,
    role: ["admin", "pharmacist"]
});

export default drugRouters;