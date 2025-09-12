export interface User {
    id: number,
    name : string,
    email : string,
    role : UserRole
    created_at? : string,
    is_banned? : boolean
}

export type UserRole = "admin" | "employer" | "seeker"

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