export type ResendOtpArgs = {
    apiUrl: string;
    email: string;
    seconds?: number;
    onMessage?: (msg: string) => void;
};

export type VerifyOtpArgs = {
    apiUrl: string;
    email: string;
    otp: string;
    onMessage?: (msg: string) => void;
};

export type ForgotPasswordArgs = {
    apiUrl: string;
    email: string;
    onMessage?: (msg: string) => void;
};

export type ResetPasswordArgs = {
    apiUrl: string;
    email: string;
    password: string;
    confirm: string;
    onMessage?: (msg: string) => void;
};
