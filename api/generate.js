export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Nur POST erlaubt"
    });
  }

  try {
    const prompt = req.body?.prompt;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt fehlt"
      });
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
          input: {
            prompt: prompt
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || data.error || "Replicate Fehler"
      });
    }

    return res.status(200).json({
      success: true,
      output: data.output,
      prediction: data.id
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Serverfehler"
    });
  }
}
