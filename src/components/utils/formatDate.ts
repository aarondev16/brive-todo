import { isValid, parseISO } from "date-fns";

export function formatDate(date: string | undefined) {
	if (!date) return "";
	// Extraer solo la parte de fecha (YYYY-MM-DD) para evitar problemas de zona horaria
	const dateOnly = date.split("T")[0];
	const dateObj = parseISO(dateOnly);
	if (!isValid(dateObj)) return "";
	return dateObj.toLocaleDateString("es-MX", {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
	});
}
