import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProject } from "@/hooks/useProject";

const projectSchema = z.object({
	name: z.string().min(1, "El nombre del proyecto es requerido"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const CreateProject = () => {
	const [open, setOpen] = useState(false);
	const { mutateAsync: createProject, isPending } = useCreateProject();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (data: ProjectFormValues) => {
		try {
			await createProject(data);
			reset();
			setOpen(false);
		} catch (error) {
			console.error("Error al crear el proyecto:", error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<Plus className="size-4 cursor-pointer" />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crear proyecto</DialogTitle>
					<DialogDescription>Crear un proyecto nuevo</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nombre del proyecto</Label>
							<Input
								id="name"
								{...register("name")}
								placeholder="Mi nuevo proyecto"
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && (
								<p className="mt-1 text-red-500 text-sm">
									{errors.name.message}
								</p>
							)}
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancelar
							</Button>
						</DialogClose>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Creando..." : "Crear proyecto"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateProject;
