import type { ReactElement } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion.tsx";

import type { Task } from "@/types/task.ts";

export function TasksAccordion(props: {
	completedGroup: boolean;
	groupKey: string;
	tasks: Task[];
	callbackfn: (task: Task) => ReactElement;
}) {
	return (
		<Accordion
			type="single"
			collapsible
			defaultValue={props.completedGroup ? undefined : props.groupKey}
			className="mb-2"
		>
			<AccordionItem value={props.groupKey}>
				<AccordionTrigger className="text-left">
					{props.groupKey} {props.completedGroup && `(${props.tasks.length})`}
				</AccordionTrigger>
				<AccordionContent>{props.tasks.map(props.callbackfn)}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
