export type User = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    roleId: string;
}

export type UserPayload = {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
}