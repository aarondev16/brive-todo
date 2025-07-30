import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/useAuth";

export const Route = createLazyFileRoute("/auth/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

	const register = useRegister();

	const validateForm = () => {
		const newErrors: {
			name?: string;
			email?: string;
			password?: string;
			confirmPassword?: string;
		} = {};

		if (!name.trim()) {
			newErrors.name = "El nombre es requerido";
		} else if (name.trim().length < 2) {
			newErrors.name = "El nombre debe tener al menos 2 caracteres";
		}

		if (!email) {
			newErrors.email = "El email es requerido";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Email inválido";
		}

		if (!password) {
			newErrors.password = "La contraseña es requerida";
		} else if (password.length < 6) {
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		register.mutate({
			name: name.trim(),
			email,
			password,
		});
	};

	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex w-full max-w-md flex-col gap-6">
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-6">
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
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="name">Nombre completo</Label>
								<Input
									id="name"
									type="text"
									placeholder="Tu nombre completo"
									value={name}
									onChange={(e) => setName(e.target.value)}
									disabled={register.isPending}
									required
									className={errors.name ? "border-red-500" : ""}
								/>
								{errors.name && (
									<p className="text-red-500 text-sm">{errors.name}</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Correo electrónico</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@ejemplo.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									disabled={register.isPending}
									required
									className={errors.email ? "border-red-500" : ""}
								/>
								{errors.email && (
									<p className="text-red-500 text-sm">{errors.email}</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									type="password"
									placeholder="Mínimo 6 caracteres"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={register.isPending}
									required
									className={errors.password ? "border-red-500" : ""}
								/>
								{errors.password && (
									<p className="text-red-500 text-sm">{errors.password}</p>
								)}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="confirmPassword">Confirmar contraseña</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Repite tu contraseña"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									disabled={register.isPending}
									required
									className={errors.confirmPassword ? "border-red-500" : ""}
								/>
								{errors.confirmPassword && (
									<p className="text-red-500 text-sm">
										{errors.confirmPassword}
									</p>
								)}
							</div>
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
