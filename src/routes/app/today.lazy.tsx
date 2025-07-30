import { createLazyFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/TaskList.tsx";

export const Route = createLazyFileRoute("/app/today")({
	component: RouteComponent,
});

function RouteComponent() {
	return <TaskList scope="today" />;
}
