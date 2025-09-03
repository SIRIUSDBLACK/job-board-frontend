export interface User {
    id: number,
    name : string,
    email : string,
    role : "admin" | "employer" | "seeker"
    created_at : string,
}

export interface RegisterPayload {
    name : string | null,
    email : string | null,
    password : string | null,
    role : string | null
}
export interface LoginPayload {
    email : string | null,
    password : string | null,
}