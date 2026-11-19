import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { db } from "../mongodb/mongodb.service";

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
            defaultRole: "cashier",           // Default role for new user
            adminRoles: ["admin", "pharmacist"] // Roles yang punya akses admin
        })
    ],

    user: {
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