import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/useAuth";

type FormErrors = {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
};

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;

function AppHeader() {
	return (
		<div className="flex flex-col items-center gap-2">
			<div className="flex flex-col items-center gap-2 font-medium">
				<div className="flex size-8 items-center justify-center rounded-md">
					<GalleryVerticalEnd className="size-6" />
				</div>
				<span className="sr-only">Acme Inc.</span>
			</div>
			<h1 className="font-bold text-xl">Crear cuenta en Brivé To Do</h1>
			<div className="text-center text-sm">
				Ya tienes una cuenta?{" "}
				<Link to="/auth/login" className="underline underline-offset-4">
					Inicia sesión
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

function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<FormErrors>({});

	const register = useRegister();

	const validateForm = () => {
		const newErrors: FormErrors = {};
		const trimmedName = name?.trim();

		if (!trimmedName) {
			newErrors.name = "El nombre es requerido";
		} else if (trimmedName.length < MIN_NAME_LENGTH) {
			newErrors.name = "El nombre debe tener al menos 2 caracteres";
		}

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

		if (!confirmPassword) {
			newErrors.confirmPassword = "Confirma tu contraseña";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "Las contraseñas no coinciden";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		register.mutate({
			name: name?.trim(),
			email,
			password,
		});
	};

	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex w-full max-w-md flex-col gap-6">
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-6">
						<AppHeader />
						<div className="flex flex-col gap-6">
							<FormField
								id="name"
								type="text"
								label="Nombre completo"
								placeholder="Tu nombre completo"
								value={name}
								onChange={setName}
								error={errors.name}
								disabled={register.isPending}
							/>
							<FormField
								id="email"
								type="email"
								label="Correo electrónico"
								placeholder="m@ejemplo.com"
								value={email}
								onChange={setEmail}
								error={errors.email}
								disabled={register.isPending}
							/>
							<FormField
								id="password"
								type="password"
								label="Contraseña"
								placeholder="Mínimo 6 caracteres"
								value={password}
								onChange={setPassword}
								error={errors.password}
								disabled={register.isPending}
							/>
							<FormField
								id="confirmPassword"
								type="password"
								label="Confirmar contraseña"
								placeholder="Repite tu contraseña"
								value={confirmPassword}
								onChange={setConfirmPassword}
								error={errors.confirmPassword}
								disabled={register.isPending}
							/>
							<Button
								type="submit"
								className="mt-4 w-full"
								disabled={register.isPending}
							>
								{register.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creando cuenta...
									</>
								) : (
									"Crear cuenta"
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export const Route = createLazyFileRoute("/auth/signup")({
	component: SignupPage,
});
