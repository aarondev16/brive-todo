import { createFileRoute, Link } from "@tanstack/react-router";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthenticated, useLogin } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	loader: async () => {
		if (isAuthenticated()) {
			window.location.href = "/app";
		}
	},
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	const login = useLogin();

	const validateForm = () => {
		const newErrors: { email?: string; password?: string } = {};

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

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		login.mutate({
			email,
			password,
		});
	};

	return (
		<div className="flex h-dvh items-center justify-between">
			<div className="mx-auto w-md">
				<div className={cn("flex flex-col gap-6")}>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-6">
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
									<Link
										to="/auth/signup"
										className="underline underline-offset-4"
									>
										Registrate
									</Link>
								</div>
							</div>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Correo electrónico</Label>
									<Input
										id="email"
										type="email"
										placeholder="m@ejemplo.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={login.isPending}
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
										placeholder="********"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={login.isPending}
										required
										className={errors.password ? "border-red-500" : ""}
									/>
									{errors.password && (
										<p className="text-red-500 text-sm">{errors.password}</p>
									)}
								</div>
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
