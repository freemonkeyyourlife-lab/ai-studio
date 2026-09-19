export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST erforderlich" });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "Prompt fehlt" });
    }

    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "REPLICATE_API_TOKEN fehlt" });
    }

    const r = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "wait"
        },
        body: JSON.stringify({
          input: { prompt: prompt.trim() }
        })
      }
    );

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data.detail || "Replicate-Fehler"
      });
    }

    return res.status(200).json({
      success: true,
      image: Array.isArray(data.output) ? data.output[0] : data.output
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Serverfehler"
    });
  }
}
