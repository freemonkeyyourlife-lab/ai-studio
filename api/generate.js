export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Nur POST erlaubt"
    });
  }

  const prompt = req.body?.prompt;

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt fehlt"
    });
  }

  return res.status(200).json({
    success: true,
    prompt: prompt
  });
}
