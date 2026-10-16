const backendOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BACKEND_BASE_URL).origin;
  } catch {
    return "";
  }
})();

const isAllowedDocumentUrl = (value) => {
  let parsed;

  try {
    parsed = new URL(value, backendOrigin || undefined);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (!backendOrigin) return null;

  const backendHost = new URL(backendOrigin).hostname;
  const allowedHost =
    parsed.hostname === backendHost ||
    parsed.hostname.endsWith(".tizzygroup.com") ||
    parsed.hostname === "tizzygroup.com";

  if (!allowedHost) return null;

  return parsed.toString();
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end();
    return;
  }

  const documentUrl = isAllowedDocumentUrl(req.query.url);

  if (!documentUrl) {
    res.status(400).json({ message: "Invalid document URL" });
    return;
  }

  try {
    const response = await fetch(documentUrl);

    if (!response.ok) {
      res.status(response.status).end();
      return;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream",
    );
    res.setHeader("Cache-Control", "private, no-store");
    res.send(buffer);
  } catch {
    res.status(502).json({ message: "Could not read document" });
  }
}
