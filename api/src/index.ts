import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { authServiceApi } from "./auth/auth.service";
import { setupErrorHandler } from "./error/error.service";
import userRouters from "./users/user.router";
import { v2 } from "cloudinary";
import drugRouters from "./drugs/drug.router";
import transactionRouters from "./transactions/transaction.router";

const port = import.meta.env.PORT || 3000;

v2.config({
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME
});

const app = new Elysia()
.use(setupErrorHandler)
.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3000"]
}))
.use(drugRouters)
.use(transactionRouters)
.use(userRouters)
.all("/api/auth/*", async ({ request }) => await authServiceApi.handler(request))
.get("/", () => "🦊 Hello, this is Elysia")
.get("/api", () => "🦊 Elysia API is ready")
.get("/api/v1", () => "🦊 Elysia API current version: 1.0")
.listen(port, () => console.log(`🦊 Elysia is running at http://localhost:${port}`));

export default app;