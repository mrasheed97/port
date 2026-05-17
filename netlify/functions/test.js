exports.handler = async function (event) {
  const finnhubKey = process.env.FINNHUB_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Test Finnhub
  let finnhubStatus = "NOT TESTED";
  let finnhubData = null;
  if (finnhubKey) {
    try {
      const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=NVDA&token=${finnhubKey}`);
      const d = await r.json();
      finnhubStatus = r.ok ? "OK" : `ERROR ${r.status}`;
      finnhubData = d;
    } catch (e) {
      finnhubStatus = `EXCEPTION: ${e.message}`;
    }
  }

  // Test Anthropic
  let anthropicStatus = "NOT TESTED";
  if (anthropicKey) {
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 10,
          messages: [{ role: "user", content: "say hi" }],
        }),
      });
      const d = await r.json();
      anthropicStatus = r.ok ? "OK" : `ERROR ${r.status}: ${JSON.stringify(d).slice(0, 100)}`;
    } catch (e) {
      anthropicStatus = `EXCEPTION: ${e.message}`;
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      env: {
        FINNHUB_API_KEY: finnhubKey ? `SET (${finnhubKey.length} chars, starts: ${finnhubKey.slice(0,4)}...)` : "NOT SET",
        ANTHROPIC_API_KEY: anthropicKey ? `SET (${anthropicKey.length} chars, starts: ${anthropicKey.slice(0,7)}...)` : "NOT SET",
      },
      finnhub: { status: finnhubStatus, sample: finnhubData },
      anthropic: { status: anthropicStatus },
    }, null, 2),
  };
};
