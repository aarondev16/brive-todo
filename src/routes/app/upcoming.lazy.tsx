import { createLazyFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/TaskList.tsx";

function UpcomingPage() {
	return <TaskList scope="upcoming" />;
}

export const Route = createLazyFileRoute("/app/upcoming")({
	component: UpcomingPage,
});
