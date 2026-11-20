import Elysia from "elysia";
import { authServiceApi } from "./auth.service";
import { DrugStoreApiError } from "../error/error.service";

export const authMiddleware = (app: Elysia) => {
    return app
    .derive(async ({ request }) => {
        const session = await authServiceApi.api.getSession({ headers: request.headers });
        if (session) return { user: session.user }
    })
    .macro({
        auth: {
            async resolve({ user }) {
                if (!user) throw new DrugStoreApiError(401, "Unauthorized");
                return { user }
            }
        },
        role: (allowedRoles: string[]) => ({
            async resolve({ user }) {
                if (!user) throw new DrugStoreApiError(401, "Unauthorized");

                const usersRole = user.role ?? "cashier";

                if (!allowedRoles.includes(usersRole)) {
                    throw new DrugStoreApiError(403, "You are not allowed to access");
                }

                return { user }
            }
        })
    });
}