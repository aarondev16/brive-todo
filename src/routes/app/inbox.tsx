import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/TaskList.tsx";

function InboxPage() {
	return <TaskList scope="inbox" />;
}

export const Route = createFileRoute("/app/inbox")({
	component: InboxPage,
});
