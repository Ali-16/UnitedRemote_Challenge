export interface AuthErrors {
  email: string[]; 
  password: string[];
  register_email?: string[];
  register_password?: string[]; 
  register_password_confirmation?: string[];
}
