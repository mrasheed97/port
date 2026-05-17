exports.handler = async function (event) {
  // path comes in as ?path=/api/v1/quote&symbol=NVDA&token=xxx
  // We strip the token from the client and inject the server-side one if set
  const params = event.queryStringParameters || {};
  const path = params.path;

  if (!path) {
    return { statusCode: 400, body: JSON.stringify({ error: "path required" }) };
  }

  // Build query string from all params except 'path'
  const query = Object.entries(params)
    .filter(([k]) => k !== "path")
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `https://finnhub.io${path}${query ? "?" + query : ""}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Port-App/1.0" },
    });
    const body = await res.text();
    return {
      statusCode: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
