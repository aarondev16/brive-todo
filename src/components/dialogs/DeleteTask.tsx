import { TrashIcon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

export function DeleteTask(props: {
	open: boolean;
	onOpenChange: (value: ((prevState: boolean) => boolean) | boolean) => void;
	onClick: () => void;
	description: unknown;
	onClick1: () => void;
}) {
	// @ts-ignore
	return (
		<AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button variant="ghost" size="icon" onClick={props.onClick}>
					<TrashIcon className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{`¿Eliminar tarea “${props.description}”?`}
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no se puede deshacer. La tarea se eliminará
						permanentemente.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						onClick={props.onClick1}
						className="bg-red-600 text-white"
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
