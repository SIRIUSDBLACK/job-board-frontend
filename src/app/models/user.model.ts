export interface User {
    id: number,
    name : string,
    email : string,
    role : "admin" | "employer" | "seeker"
    created_at : string,
}