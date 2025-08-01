import { addDays, isValid, parseISO, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type FC, useEffect, useState } from "react";
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
	const today = startOfDay(new Date());

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [input, setInput] = useState("");
	const [open, setOpen] = useState(false);
	useEffect(() => {
		if (value) {
			const dateOnly = value.split("T")[0];
			const parsed = parseISO(dateOnly);
			if (isValid(parsed)) {
				const sd = startOfDay(parsed);
				setSelectedDate(sd);
				setInput(formatLabel(sd));
				return;
			}
		}
		setSelectedDate(undefined);
		setInput("");
	}, [value]);

	const presets = [
		{ label: "Hoy", offset: 0 },
		{ label: "Mañana", offset: 1 },
		{ label: "En 3 días", offset: 3 },
		{ label: "En 1 semana", offset: 7 },
		{ label: "En 2 semanas", offset: 14 },
	];

	const isoFormat = (d: Date) => {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		return `${y}-${m}-${day}`;
	};

	const handleSelectDate = (d?: Date) => {
		if (!d) return;
		const sd = startOfDay(d);
		setSelectedDate(sd);
		onChange(isoFormat(sd));
		setInput(formatLabel(sd));
		setOpen(false);
	};

	const handlePreset = (offset: number, label: string) => {
		const d = startOfDay(addDays(today, offset));
		setSelectedDate(d);
		onChange(isoFormat(d));
		setInput(label);
		setOpen(false);
	};

	const handleInput = (text: string) => {
		setInput(text);
		if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
			const d = parseISO(text);
			if (isValid(d)) {
				const sd = startOfDay(d);
				setSelectedDate(sd);
				onChange(isoFormat(sd));
				return;
			}
		}
		if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
			const [dd, mm, yyyy] = text.split("/");
			const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
			if (isValid(d)) {
				const sd = startOfDay(d);
				setSelectedDate(sd);
				onChange(isoFormat(sd));
				return;
			}
		}
		onChange(null);
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
				placeholder="dd/MM/yyyy o YYYY-MM-DD"
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
						selected={selectedDate}
						onSelect={handleSelectDate}
						defaultMonth={today}
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
		month: "2-digit",
		year: "numeric",
	});
