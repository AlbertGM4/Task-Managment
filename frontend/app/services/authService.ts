// frontend/app/services/authService.ts
import "dotenv/config"
import { AuthResponse } from "~/models/auth";

const apiUrl = process.env.API_URL as string;

if (!apiUrl) {
    throw new Error('API_URL is not defined. Make sure it is available in your environment.');
}

// Login de usuario
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    console.log("---- Iniciando sesión ----");
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Error al iniciar sesión: ${response.statusText}`);
        }

        const data: AuthResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
}

// Registro de usuario
export async function registerUser(email: string, password: string, name: string): Promise<AuthResponse> {
    console.log("---- Registrando usuario ----");
    try {
        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
            throw new Error(`Error al registrar usuario: ${response.statusText}`);
        }

        const data: AuthResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error en registerUser:", error);
        throw error;
    }
}

// Verificación de token o sesión
export async function verifyToken(token: string): Promise<boolean> {
    console.log("---- Verificando token ----");
    try {
        const response = await fetch(`${apiUrl}/auth/verify-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al verificar el token');
        }

        const data = await response.json();
        return data.valid;
    } catch (error) {
        console.error("Error en verifyToken:", error);
        throw error;
    }
}
