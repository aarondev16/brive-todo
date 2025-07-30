import { parseDate } from "chrono-node";
import { addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type FC, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
	value: string | null;
	onChange: (iso: string | null) => void;
}

export const TaskDatePicker: FC<DatePickerProps> = ({ value, onChange }) => {
	const today = useMemo(() => new Date(), []);
	const initialDate = useMemo(
		() => (value ? new Date(value) : today),
		[value, today],
	);
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState(() =>
		value ? formatLabel(initialDate) : "",
	);

	const presets = useMemo(
		() => [
			{ label: "Hoy", offset: 1 },
			{ label: "Mañana", offset: 2 },
			{ label: "En 3 días", offset: 4 },
			{ label: "En 1 semana", offset: 8 },
			{ label: "En 2 semanas", offset: 15 },
		],
		[],
	);

	const iso = (d: Date) => d.toISOString().split("T")[0];

	const handleSelectDate = (d?: Date) => {
		if (!d) return;
		onChange(iso(d));
		setInput(formatLabel(d));
		setOpen(false);
	};

	const handlePreset = (offset: number, label: string) => {
		const d = addDays(today, offset);
		onChange(iso(d));
		setInput(label);
		setOpen(false);
	};

	const handleInput = (text: string) => {
		setInput(text);
		// @ts-ignore
		const parsed = parseDate(text, { forwardDate: true }) ?? undefined;
		onChange(parsed ? iso(parsed) : null);
	};

	return (
		<div className="relative w-full">
			<Input
				value={input}
				onChange={(e) => handleInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setOpen(true);
					}
				}}
				className="pr-10"
				placeholder="Ingresa una fecha"
			/>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="-translate-y-1/2 absolute top-1/2 right-2"
						aria-label="Abrir calendario"
					>
						<CalendarIcon className="size-4" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={initialDate}
						onSelect={handleSelectDate}
						defaultMonth={initialDate}
						captionLayout="dropdown"
						className="mx-auto bg-transparent"
					/>
					<div className="flex flex-wrap gap-2 border-t p-2">
						{presets.map(({ label, offset }) => (
							<Button
								key={label}
								variant="outline"
								size="sm"
								className="flex-1"
								onClick={() => handlePreset(offset, label)}
							>
								{label}
							</Button>
						))}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

const formatLabel = (d: Date) =>
	d.toLocaleDateString("es-MX", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
