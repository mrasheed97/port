exports.handler = async function (event) {
  const params = event.queryStringParameters || {};
  const path = params.path;

  if (!path) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "path required" }),
    };
  }

  // Use server-side key if set, otherwise fall through to client-provided token
  const serverKey = process.env.FINNHUB_API_KEY;

  const queryParams = Object.entries(params)
    .filter(([k]) => k !== "path")
    .map(([k, v]) => {
      // Replace client token with server token if available
      if (k === "token" && serverKey) return `token=${serverKey}`;
      return `${k}=${encodeURIComponent(v)}`;
    })
    .join("&");

  const url = `https://finnhub.io${path}${queryParams ? "?" + queryParams : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Port-App/2.0",
        "Accept": "application/json",
      },
    });

    const body = await res.text();

    if (!res.ok) {
      console.error("Finnhub error:", res.status, path, body.slice(0, 200));
    }

    return {
      statusCode: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body,
    };
  } catch (e) {
    console.error("Finnhub exception:", e.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
