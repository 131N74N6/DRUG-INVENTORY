import { create, type StateCreator } from "zustand";
import type { AuthState, SignInState, SignUpState } from "./authModel";

const signInStore: StateCreator<SignInState> = (set) => ({
    signedInEmail: "",
    setSignedInEmail: (signedInEmail: string) => set({ signedInEmail }),

    signedInPassword: "",
    setSignedInPassword: (signedInPassword: string) => set({ signedInPassword }),

    resetSignInState: () => set({
        signedInEmail: "", 
        signedInPassword: ""
    })
});

const signUpStore: StateCreator<SignUpState> = (set) => ({
    signedUpAddress: "",
    setSignedUpAddress: (signedUpAddress: string) => set({ signedUpAddress }),

    signedUpEmail: "",
    setSignedUpEmail: (signedUpEmail: string) => set({ signedUpEmail }),

    signedUpGender: "",
    setSignedUpGender: (signedUpGender: string) => set({ signedUpGender }),

    signedUpPassword: "",
    setSignedUpPassword: (signedUpPassword: string) => set({ signedUpPassword }),

    signedUpName: "",
    setSignedUpName: (signedUpName: string) => set({ signedUpName }),

    signedUpPhone: "",
    setSignedUpPhone: (signedUpPhone: string) => set({ signedUpPhone }),

    resetSignUpState: () => set({
        signedUpAddress: "",
        signedUpEmail: "", 
        signedUpGender: "",
        signedUpName: "",
        signedUpPassword: "",
        signedUpPhone: ""
    })
});

const useAuthStore = create<AuthState>()((...b) => ({
    ...signInStore(...b),
    ...signUpStore(...b)
}));

export default useAuthStore;