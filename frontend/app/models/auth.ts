// frontend/app/models/auth.ts

export interface AuthResponse {
    token: string; // El token JWT devuelto por el backend
    user: AuthUser; // La información del usuario autenticado
  }

  export interface AuthUser {
    id: string; // ID del usuario
    name: string; // Nombre del usuario
    email: string; // Email del usuario
  }

  // Puedes también tener una interfaz para la solicitud de login
  export interface LoginRequest {
    email: string;
    password: string;
  }

  // Para el registro de usuario
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
  }
