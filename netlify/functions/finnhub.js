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

  // Rebuild the URL without double-encoding — pass params directly
  const query = Object.entries(params)
    .filter(([k]) => k !== "path")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `https://finnhub.io${path}${query ? "?" + query : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Port-App/2.0",
        "Accept": "application/json",
      },
    });

    const body = await res.text();

    if (!res.ok) {
      console.error("Finnhub error:", res.status, url, body.slice(0, 200));
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
    console.error("Finnhub fetch error:", e.message);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
