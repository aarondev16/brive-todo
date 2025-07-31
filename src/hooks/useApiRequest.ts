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
): Promise<T> => {
	const config: AxiosRequestConfig = {
		method,
		url: endpoint,
	};

	if (method !== "GET" && data) {
		config.data = data;
	}

	const response: AxiosResponse<T> = await appApiClient(config);
	return response.data;
};

export const useApiQuery = <T = unknown, R = T>(
	endpoint: string,
	options?: {
		enabled?: boolean;
		gcTime?: number;
		staleTime?: number;
		transformFn?: (data: T) => R;
	},
): UseQueryResult<R, Error> => {
	return useQuery<R, Error>({
		queryKey: [endpoint],
		queryFn: async () => {
			const raw = await apiRequest<T>(endpoint, "GET", undefined);
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
	},
): UseMutationResult<TData, Error, TVariables> => {
	const queryClient = useQueryClient();

	return useMutation<TData, Error, TVariables>({
		mutationFn: (variables) => {
			const resolvedEndpoint =
				typeof endpoint === "function" ? endpoint(variables) : endpoint;
			return apiRequest<TData>(resolvedEndpoint, method, variables);
		},
		onSuccess: (data) => {
			const queriesToInvalidate = options?.invalidateQueries ?? [endpoint];

			queriesToInvalidate.forEach((key) => {
				queryClient
					.invalidateQueries({
						predicate: (q) =>
							typeof q.queryKey[0] === "string" &&
							// @ts-ignore
							(q.queryKey[0] as string).startsWith(key),
					})
					.then((r) => r);
			});

			if (options?.showToast !== false) {
				const message =
					(data as { meta: { message: string } })?.meta?.message ||
					options?.successMessage;
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
