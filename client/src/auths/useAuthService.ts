import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { AuthServiceApi } from "../../../api/src/auths/auth.model";
import useAuthStore from "./useAuthStore";

export default function useAuthService() {
    const queryClient = useQueryClient();

    const signedInEmail = useAuthStore((state) => state.signedInEmail);
    const signedInPassword = useAuthStore((state) => state.signedInPassword);
    const resetSignInState = useAuthStore((state) => state.resetSignInState);

    const signedUpEmail = useAuthStore((state) => state.signedInEmail);
    const signedUpPassword = useAuthStore((state) => state.signedUpPassword);
    const resetSignUpState = useAuthStore((state) => state.resetSignUpState);

    const authClient = createAuthClient({
        baseURL: import.meta.env.VITE_BASE_API_URL,
        plugins: [inferAdditionalFields<AuthServiceApi>()],
        fetchOptions: { credentials: "include" }
    })

    return {
        signIn: useMutation({
            mutationFn: async () => {
                const request = await authClient.signIn.email({
                    email: signedInEmail.trim(),
                    password: signedInPassword.trim()
                });

                if (request.error) throw new Error(request.error.message);
                return request.data.user;
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["current-user"] });
                resetSignInState();
            }
        }),

        signOut: useMutation({
            mutationFn: async () => {
                const request = await authClient.signOut();
                if (request.error) throw new Error(request.error.message);
                return request.data;
            },
            onSuccess: () => {
                resetSignInState();
                resetSignUpState();
            }
        }),

        signUp: useMutation({
            mutationFn: async () => {
                const request = await authClient.signUp.email({
                    email: signedUpEmail.trim(),
                    password: signedUpPassword.trim()
                });

                if (request.error) throw new Error(request.error.message);
                return request.data.user;
            },
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["current-user"] });
                resetSignUpState();
            }
        }),
        
        showcurrentUser: useQuery({
            queryFn: async () => {},
            queryKey: ["current-user"]
        });
    }
}