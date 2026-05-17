exports.handler = async function (event) {
  const { ticker, period } = event.queryStringParameters || {};
  if (!ticker) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "ticker required" }),
    };
  }

  // Map period to Yahoo Finance interval + range
  const configs = {
    "1D": { interval: "5m",  range: "5d"  }, // 5-day range catches weekends
    "1W": { interval: "30m", range: "5d"  },
    "1M": { interval: "1d",  range: "1mo" },
    "3M": { interval: "1d",  range: "3mo" },
    "1Y": { interval: "1wk", range: "1y"  },
  };

  const { interval, range } = configs[period] || configs["1M"];
  const sym = ticker.toUpperCase();

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=${interval}&range=${range}&includePrePost=false`;

  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
  };

  // Try query1 then query2 as fallback
  for (const host of ["query1", "query2"]) {
    try {
      const fetchUrl = url.replace("query1", host);
      const res = await fetch(fetchUrl, { headers });
      if (!res.ok) continue;

      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) continue;

      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const closes = quote.close || [];
      const opens  = quote.open  || [];
      const highs  = quote.high  || [];
      const lows   = quote.low   || [];
      const meta   = result.meta || {};

      // Filter out null values (market closed gaps)
      const valid = timestamps.map((t, i) => ({
        t, o: opens[i], h: highs[i], l: lows[i], c: closes[i]
      })).filter(r => r.c != null);

      // For 1D, only return the most recent trading day
      let filtered = valid;
      if (period === "1D" && valid.length > 0) {
        const lastTs = valid[valid.length - 1].t;
        const lastDate = new Date(lastTs * 1000).toDateString();
        filtered = valid.filter(r => new Date(r.t * 1000).toDateString() === lastDate);
        // If that's empty (shouldn't be), fall back to all
        if (filtered.length === 0) filtered = valid.slice(-78); // ~1 trading day of 5m bars
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300", // cache 5 min
        },
        body: JSON.stringify({
          s: "ok",
          t: filtered.map(r => r.t),
          o: filtered.map(r => r.o),
          h: filtered.map(r => r.h),
          l: filtered.map(r => r.l),
          c: filtered.map(r => r.c),
          meta: {
            currentPrice: meta.regularMarketPrice,
            previousClose: meta.previousClose,
            currency: meta.currency,
            symbol: meta.symbol,
          },
        }),
      };
    } catch (e) {
      console.error("Yahoo chart error:", host, e.message);
    }
  }

  return {
    statusCode: 404,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ error: "No chart data found for " + ticker }),
  };
};
