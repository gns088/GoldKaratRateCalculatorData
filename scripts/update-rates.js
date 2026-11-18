#!/usr/bin/env node
/**
 * Pull today's IBJA session and write rates.json.
 * Leaves the existing file untouched when the session and prices are unchanged,
 * and when the request fails.
 */
const fs = require('fs');
const path = require('path');

const API = 'https://api.dharun.dev/v1/bullion';
const OUT = path.join(__dirname, '..', 'rates.json');

const SESSION_RANK = { AM: 1, MORNING: 1, PM: 2, EVENING: 2 };

function sessionRank(session) {
  const rank = SESSION_RANK[String(session || '').toUpperCase()];
  return rank === undefined ? 0 : rank;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function main() {
  const response = await fetch(API);
  if (!response.ok) fail(`IBJA request failed: ${response.status}`);

  const body = await response.json();
  const rates = body?.data?.rates;
  if (!Array.isArray(rates) || rates.length === 0) fail('IBJA response had no rates');

  const bestRank = Math.max(...rates.map(row => sessionRank(row.session)));
  const chosen = bestRank > 0 ? rates.filter(row => sessionRank(row.session) === bestRank) : rates;
  const find = (metal, purity) => chosen.find(row => row.metal === metal && String(row.purity) === purity);

  const gold24 = find('gold', '999');
  const gold22 = find('gold', '916');
  const gold18 = find('gold', '750');
  const gold14 = find('gold', '585');
  const silver = find('silver', '999');

  if (!gold24 || !gold22 || !gold18 || !gold14 || !silver) {
    fail('IBJA response is missing 24K, 22K, 18K, 14K, or silver');
  }

  const next = {
    source: 'IBJA',
    sourceUrl: 'https://ibjarates.com/',
    date: body.data.date,
    session: String(gold24.session),
    fetchedAt: new Date().toISOString(),
    gold24kPer10g: gold24.rupees,
    gold22kPer10g: gold22.rupees,
    gold18kPer10g: gold18.rupees,
    gold14kPer10g: gold14.rupees,
    silverPerKg: silver.rupees,
    change: gold24.change,
    previousDate: gold24.previousDate,
    silverChange: silver.change,
    note: 'IBJA benchmark for India, before GST and making charges.',
  };

  for (const key of ['gold24kPer10g', 'gold22kPer10g', 'gold18kPer10g', 'gold14kPer10g', 'silverPerKg']) {
    if (typeof next[key] !== 'number' || !Number.isFinite(next[key]) || next[key] <= 0) {
      fail(`Invalid ${key}`);
    }
  }
  if (typeof next.date !== 'string' || !next.session) fail('IBJA response is missing the session date');

  let current = null;
  if (fs.existsSync(OUT)) {
    try {
      current = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    } catch {
      current = null;
    }
  }

  const sameSession =
    current &&
    current.date === next.date &&
    current.session === next.session &&
    current.gold24kPer10g === next.gold24kPer10g &&
    current.gold22kPer10g === next.gold22kPer10g &&
    current.gold18kPer10g === next.gold18kPer10g &&
    current.gold14kPer10g === next.gold14kPer10g &&
    current.silverPerKg === next.silverPerKg;

  if (sameSession) {
    console.log(`Unchanged ${next.date} ${next.session}`);
    return;
  }

  fs.writeFileSync(OUT, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Wrote ${next.date} ${next.session} 24K ${next.gold24kPer10g}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
