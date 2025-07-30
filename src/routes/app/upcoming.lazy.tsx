import { createLazyFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/TaskList.tsx";

export const Route = createLazyFileRoute("/app/upcoming")({
	component: RouteComponent,
});

function RouteComponent() {
	return <TaskList scope="upcoming" />;
}
