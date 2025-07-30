export function formatDate(date: string | undefined) {
	if (!date) return "";
	const dateObj = new Date(date);
	return dateObj.toLocaleDateString("es-MX", {
		month: "2-digit",
		day: "2-digit",
		year: "2-digit",
		timeZone: "UTC",
	});
}
