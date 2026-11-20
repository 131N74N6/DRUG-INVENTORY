import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { db } from "../mongodb/mongodb.service";

const statement = {
    user: ["create", "read", "update", "delete"],
    transaction: ["create", "read", "update", "delete"],
    drug: ["create", "read", "update", "delete"]
} as const;

const ac = createAccessControl(statement);

const adminRole = ac.newRole({
    user: ["create", "read", "update", "delete"],
    transaction: ["create", "read", "update", "delete"],
    drug: ["create", "read", "update", "delete"]
});

const pharmacistRole = ac.newRole({
    drug: ["create", "read", "update", "delete"],
    transaction: ["create", "read", "update"]
});

const cashierRole = ac.newRole({
    transaction: ["create", "read"]
});

export const authServiceApi = betterAuth({
    database: mongodbAdapter(db()),
    secret: import.meta.env.BETTER_AUTH_SECRET,
    baseURL: import.meta.env.BETTER_AUTH_URL,

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 128
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,    // 7 days
        updateAge: 60 * 60 * 24,         // Update every 24 hours
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5                  // Cache 5 minutes
        }
    },

    plugins: [
        admin({
            ac,
            adminRoles: ["admin", "pharmacist"],
            defaultRole: "cashier",
            roles: {
                admin: adminRole,
                pharmacist: pharmacistRole,
                cashier: cashierRole
            }
        })
    ],

    user: {
        roles: ["admin", "pharmacist", "cashier"], 
        defaultRole: "cashier",
        additionalFields: {
            address: { type: "string", required: true },
            gender: { type: "string", required: true },
            image_filename: { type: "string", required: true },
            image_filetype: { type: "string", required: true },
            image_public_id: { type: "string", required: true },
            image_resource_type: { type: "string", required: true },
            phone: { type: "string", required: true },
        }
    },

    advanced: {
        cookies: {
            session_token: {
                attributes: {
                    secure: process.env.NODE_ENV === "production", // Hanya kirim via HTTPS di produksi
                    httpOnly: true,  // Mencegah akses via JavaScript (XSS protection)
                    sameSite: "lax", // Mencegah CSRF
                }
            }
        }
    }
});