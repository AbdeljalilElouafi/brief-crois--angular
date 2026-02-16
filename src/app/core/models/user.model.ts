export interface User {
    id?: string;
    email: string;
    password?: string; // Optional for security when stored in frontend
    firstName: string;
    lastName: string;
}
