
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Nur POST erlaubt"
    });
  }

  try {
    const body = req.body || {};
    const prompt = body.prompt;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt fehlt"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Auftrag angenommen",
      prompt: prompt
    });

  } catch (error) {
    return res.status(500).json({
      error: "Serverfehler"
    });
  }
}
