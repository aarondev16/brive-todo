import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

export function TasksStatus(props: {
	value: "all" | "pending" | "in-progress" | "completed" | "cancelled";
	onValueChange: (value: string) => void;
}) {
	return (
		<Tabs
			value={props.value}
			onValueChange={props.onValueChange}
			className="mb-2"
		>
			<TabsList className="mx-auto">
				<TabsTrigger value="all">Todas</TabsTrigger>
				<TabsTrigger value="pending">Pendientes</TabsTrigger>
				<TabsTrigger value="in-progress">En progreso</TabsTrigger>
				<TabsTrigger value="cancelled">Canceladas</TabsTrigger>
				<TabsTrigger value="completed">Completadas</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
