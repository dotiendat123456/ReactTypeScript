// src/types/auth.ts
export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  email: string;
  status: number;
  roles: Role[];
  avatar_url: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
