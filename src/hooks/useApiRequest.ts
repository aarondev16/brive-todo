import {
	type UseMutationResult,
	type UseQueryResult,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ApiType = "app" | "auth";

// Token management functions
const getToken = (): string | null => {
	return localStorage.getItem("auth_token");
};

const removeToken = (): void => {
	localStorage.removeItem("auth_token");
};

const appApiClient = axios.create({
	baseURL: import.meta.env.VITE_APP_API,
	timeout: 10000,
});

const authApiClient = axios.create({
	baseURL: import.meta.env.VITE_AUTH_API,
	timeout: 10000,
});

appApiClient.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

appApiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			removeToken();
			toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
			// window.location.href = "/auth/login";
		}
		return Promise.reject(error);
	},
);

const apiRequest = async <T>(
	endpoint: string,
	method: HttpMethod = "GET",
	data?: unknown,
	apiType: ApiType = "app",
): Promise<T> => {
	const config: AxiosRequestConfig = {
		method,
		url: endpoint,
	};

	if (method !== "GET" && data) {
		config.data = data;
	}

	const client = apiType === "auth" ? authApiClient : appApiClient;
	const response: AxiosResponse<T> = await client(config);
	return response.data;
};

export const useApiQuery = <T = unknown, R = T>(
	endpoint: string,
	options?: {
		enabled?: boolean;
		gcTime?: number;
		staleTime?: number;
		apiType?: ApiType;
		transformFn?: (data: T) => R;
	},
): UseQueryResult<R, Error> => {
	const apiType = options?.apiType ?? "app";

	return useQuery<R, Error>({
		queryKey: [apiType, endpoint],
		queryFn: async () => {
			const raw = await apiRequest<T>(endpoint, "GET", undefined, apiType);
			return options?.transformFn
				? options.transformFn(raw)
				: (raw as unknown as R);
		},
		// gcTime: options?.gcTime ?? 10 * 60 * 1000,
		// staleTime: options?.staleTime ?? 5 * 60 * 1000,
		enabled: options?.enabled,
	});
};

export const useApiMutation = <TData = unknown, TVariables = unknown>(
	endpoint: string | ((variables: TVariables) => string),
	method: Exclude<HttpMethod, "GET"> = "POST",
	options?: {
		invalidateQueries?: string[];
		onSuccess?: (data: TData) => void;
		onError?: (error: Error) => void;
		showToast?: boolean;
		successMessage?: string;
		errorMessage?: string;
		apiType?: ApiType;
	},
): UseMutationResult<TData, Error, TVariables> => {
	const queryClient = useQueryClient();
	const apiType = options?.apiType ?? "app";

	return useMutation<TData, Error, TVariables>({
		mutationFn: (variables) => {
			const resolvedEndpoint =
				typeof endpoint === "function" ? endpoint(variables) : endpoint;
			return apiRequest<TData>(resolvedEndpoint, method, variables, apiType);
		},
		onSuccess: (data) => {
			const queriesToInvalidate = options?.invalidateQueries ?? [endpoint];

			queriesToInvalidate.forEach((key) => {
				queryClient
					.invalidateQueries({
						predicate: (q) =>
							q.queryKey[0] === apiType &&
							typeof q.queryKey[1] === "string" &&
							// @ts-ignore
							(q.queryKey[1] as string).startsWith(key),
					})
					.then((r) => r);
			});

			if (options?.showToast !== false) {
				const responseMessage =
					typeof data === "object" && data !== null && "message" in data
						? (data as { message: string }).message
						: undefined;

				const message =
					options?.successMessage ||
					responseMessage ||
					"Operación completada exitosamente";
				toast.success(message);
			}

			options?.onSuccess?.(data);
		},
		onError: (error) => {
			if (options?.showToast !== false) {
				const responseMessage =
					error.message ||
					(error as any)?.response?.data?.message ||
					(error as any)?.response?.data?.error;

				const message =
					options?.errorMessage || responseMessage || "Ocurrió un error";
				toast.error(message);
			}

			options?.onError?.(error);
		},
	});
};
