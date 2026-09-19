export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST erforderlich" });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Prompt fehlt" });
  }

  const response = await fetch(
    "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait"
      },
      body: JSON.stringify({
        input: { prompt }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({
      error: data.detail || "Replicate-Fehler"
    });
  }

  return res.status(200).json({
    success: true,
    image: Array.isArray(data.output) ? data.output[0] : data.output
  });
}
