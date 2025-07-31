import { useApiMutation } from "@/hooks/useApiRequest";

export interface User {
	id: string;
	name: string;
	email: string;
	status: string;
	createdAt: string;
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterResponse {
	data: User;
	meta: {
		status: number;
		message: string;
	};
}

export interface LoginResponse {
	data: {
		token: string;
	};
	meta: {
		status: number;
		message: string;
	};
}

// Token management
export const getToken = (): string | null => {
	return localStorage.getItem("auth_token");
};

export const setToken = (token: string): void => {
	localStorage.setItem("auth_token", token);
};

export const removeToken = (): void => {
	localStorage.removeItem("auth_token");
};

export const isAuthenticated = (): boolean => {
	return !!getToken();
};

export const useRegister = () =>
	useApiMutation<RegisterResponse, RegisterPayload>("/auth/register", "POST", {
		successMessage:
			"Usuario registrado exitosamente. Por favor, inicia sesión.",
		errorMessage: "Error al registrar usuario",
		showToast: true,
		onSuccess: () => {
			window.location.href = "/auth/login";
		},
	});

export const useLogin = () =>
	useApiMutation<LoginResponse, LoginPayload>("/auth/login", "POST", {
		successMessage: "Inicio de sesión exitoso",
		errorMessage: "Error al iniciar sesión",
		showToast: true,
		onSuccess: (data) => {
			if (data.data.token) {
				setToken(data.data.token);
				window.location.href = "/app";
			}
		},
	});

export const useLogout = () => {
	const logout = () => {
		removeToken();
		window.location.reload();
	};

	return { logout };
};
