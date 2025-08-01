import { createLazyFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/TaskList.tsx";

function TodayPage() {
	return <TaskList scope="today" />;
}

export const Route = createLazyFileRoute("/app/today")({
	component: TodayPage,
});
