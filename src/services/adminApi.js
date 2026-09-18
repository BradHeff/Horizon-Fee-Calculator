let csrfToken = "";
export async function adminApi(action, payload) {
	const response = await fetch(
		`/api/fees?action=${encodeURIComponent(action)}`,
		{
			method: payload === undefined ? "GET" : "POST",
			credentials: "same-origin",
			cache: "no-store",
			headers:
				payload === undefined
					? {}
					: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
			...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
		},
	);
	let data;
	try {
		data = await response.json();
	} catch {
		throw new Error("The fee server is unavailable. Please try again.");
	}
	if (!response.ok) {
		const error = new Error(data.error || "Unable to complete this request.");
		error.status = response.status;
		throw error;
	}
	if (data.csrfToken) csrfToken = data.csrfToken;
	return data;
}
