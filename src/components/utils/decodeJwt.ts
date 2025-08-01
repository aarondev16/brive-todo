interface JwtPayload {
	email: string;
	fullName: string;
}
export const decodeJwt = (token: string): JwtPayload | null => {
	if (!token) return null;
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
				.join(""),
		);
		const payload = JSON.parse(jsonPayload);
		payload.onboardingCompleted = payload.onboardingCompleted === "true";
		return payload;
	} catch (error) {
		console.error("Error decodificando el token:", error);
		return null;
	}
};
