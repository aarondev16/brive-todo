import { createFileRoute, Link } from "@tanstack/react-router";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthenticated, useLogin } from "@/hooks/useAuth";

type FormErrors = {
	email?: string;
	password?: string;
};

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_PASSWORD_LENGTH = 6;

function AppHeader() {
	return (
		<div className="flex flex-col items-center gap-2">
			<div className="flex flex-col items-center gap-2 font-medium">
				<div className="flex size-8 items-center justify-center rounded-md">
					<GalleryVerticalEnd className="size-6" />
				</div>
				<span className="sr-only">Acme Inc.</span>
			</div>
			<h1 className="font-bold text-xl">Bienvenido a Brivé To Do</h1>
			<div className="text-center text-sm">
				No tienes una cuenta?{" "}
				<Link to="/auth/signup" className="underline underline-offset-4">
					Registrate
				</Link>
			</div>
		</div>
	);
}

function FormField({ 
	id, 
	type, 
	label, 
	placeholder, 
	value, 
	onChange, 
	error, 
	disabled 
}: {
	id: string;
	type: string;
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	disabled: boolean;
}) {
	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				disabled={disabled}
				required
				className={error ? "border-red-500" : ""}
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
		</div>
	);
}

function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<FormErrors>({});

	const login = useLogin();

	const validateForm = () => {
		const newErrors: FormErrors = {};

		if (!email) {
			newErrors.email = "El email es requerido";
		} else if (!EMAIL_REGEX.test(email)) {
			newErrors.email = "Email inválido";
		}

		if (!password) {
			newErrors.password = "La contraseña es requerida";
		} else if (password.length < MIN_PASSWORD_LENGTH) {
			newErrors.password = "La contraseña debe tener al menos 6 caracteres";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		login.mutate({ email, password });
	};

	return (
		<div className="flex h-dvh items-center justify-between">
			<div className="mx-auto w-md">
				<div className="flex flex-col gap-6">
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
							<AppHeader />
							<div className="flex flex-col gap-6">
								<FormField
									id="email"
									type="email"
									label="Correo electrónico"
									placeholder="m@ejemplo.com"
									value={email}
									onChange={setEmail}
									error={errors.email}
									disabled={login.isPending}
								/>
								<FormField
									id="password"
									type="password"
									label="Contraseña"
									placeholder="********"
									value={password}
									onChange={setPassword}
									error={errors.password}
									disabled={login.isPending}
								/>
								<Button
									type="submit"
									className="mt-4 w-full"
									disabled={login.isPending}
								>
									{login.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Iniciando sesión...
										</>
									) : (
										"Iniciar Sesión"
									)}
								</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/auth/login")({
	component: LoginPage,
	loader: async () => {
		if (isAuthenticated()) {
			window.location.href = "/app";
		}
	},
});
