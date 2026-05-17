exports.handler = async function (event) {
  const ticker = event.queryStringParameters?.ticker;
  if (!ticker) {
    return { statusCode: 400, body: JSON.stringify({ error: "ticker required" }) };
  }

  const sym = ticker.toUpperCase() === "SPX" ? "%5EGSPC" : ticker.toUpperCase();

  // Try Yahoo Finance v8 chart endpoint
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1m&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${sym}?interval=1m&range=1d`,
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${sym}`,
    `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${sym}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) continue;
      const data = await res.json();

      // v8 chart response
      const chartPrice = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (chartPrice && chartPrice > 0) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ price: chartPrice, source: url }),
        };
      }

      // v7 quote response
      const quotePrice = data?.quoteResponse?.result?.[0]?.regularMarketPrice;
      if (quotePrice && quotePrice > 0) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ price: quotePrice, source: url }),
        };
      }
    } catch (e) {
      continue;
    }
  }

  // All attempts failed
  return {
    statusCode: 404,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ error: "Could not fetch spot price for " + ticker }),
  };
};
