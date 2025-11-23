// src/types/user.ts

export interface Department {
    id: number;
    name: string;
}

export interface Title {
    id: number;
    level: string;
    description: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface UserProfileDetail {
    birth: string | null;
    birth_place: string | null;
    identification_number: string | null;
    identification_date: string | null;
    identification_place: string | null;
    company_entry_date: string | null;
    number_of_date_attached: number | null;
    education_level: string | null;
    gender: string | null;
    bank_name: string | null;
    bank_number: string | null;
    personal_income_tax: string | null;
    insurance_number: string | null;
    relative_name: string | null;
    relative_role: string | null;
    relative_number: string | null;
    school_name: string | null;
    field: string | null;
}

export interface Skill {
    id: number;
    name: string;
    description: string | null;
}

export interface User {
    id: number;
    name: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    status: number;
    status_name: string;
    badge_name: string;
    avatar_url: string | null;
    background: string | null;
    departments: Department[];
    titles: Title[];
    roles: Role[];
    profile: UserProfileDetail | null;
    skills: Skill[];
    login_at: string | null;
}

export interface UserProfileResponse {
    message: string;
    data: User;
}

export interface UsersListResponse {
    message: string;
    data: User[];
    pagination?: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    } | null;
}

