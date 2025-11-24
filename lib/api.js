export async function predict(payload) {
  const res = await fetch("http://127.0.0.1:8000/api/predict/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  return await res.json();
}
