export type AuthState = SignInState & SignUpState;

export type SignInState = {
    signedInEmail: string;
    setSignedInEmail: (signedInEmail: string) => void;

    signedInPassword: string;
    setSignedInPassword: (signedInPassword: string) => void;

    resetSignInState: () => void;
}

export type SignUpState = {
    signedUpAddress: string;
    setSignedUpAddress: (signedUpAddress: string) => void;

    signedUpEmail: string;
    setSignedUpEmail: (email: string) => void;

    signedUpGender: string;
    setSignedUpGender: (gender: string) => void;

    signedUpName: string;
    setSignedUpName: (name: string) => void;
    
    signedUpPassword: string;
    setSignedUpPassword: (password: string) => void;

    signedUpPhone: string;
    setSignedUpPhone: (phone: string) => void;

    resetSignUpState: () => void;
}