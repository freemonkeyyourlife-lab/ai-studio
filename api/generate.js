export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "POST erforderlich"
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: "Prompt fehlt"
      });
    }

    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "REPLICATE_API_TOKEN ist in Vercel nicht gesetzt"
      });
    }

    const response = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Prefer": "wait=30"
        },
        body: JSON.stringify({
          input: {
            prompt: prompt.trim()
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Replicate API Fehler",
        status: response.status,
        detail: data.detail || data.error || JSON.stringify(data)
      });
    }

    return res.status(200).json({
      success: true,
      output: data.output,
      status: data.status
    });

  } catch (error) {
    return res.status(500).json({
      error: "Serverfehler",
      detail: error.message
    });
  }
}
