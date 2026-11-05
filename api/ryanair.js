const BASE = 'https://www.ryanair.com/api';

const HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
};

export async function getRoutes(origin) {
  const url = `${BASE}/views/locate/searchWidget/routes/nl/airport/${origin}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Ryanair routes API ${res.status}`);
  return res.json();
}

export async function getCheapestFares(origin, destination, monthDate) {
  const url = `${BASE}/farfnd/v4/oneWayFares/${origin}/${destination}/cheapestPerDay?outboundMonthOfDate=${monthDate}&currency=EUR`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Ryanair fares API ${res.status}`);
  return res.json();
}

export async function searchRyanairFlights(origin, destination, dateOut, dateIn, adults = 1, children = 0) {
  const flights = [];

  // Outbound fares
  const outboundData = await getCheapestFares(origin, destination, dateOut);
  const outboundFares = outboundData?.outbound?.fares || [];

  for (const fare of outboundFares) {
    if (!fare.price || fare.unavailable) continue;

    const depDate = fare.departureDate;
    const arrDate = fare.arrivalDate;
    if (!depDate) continue;

    const dep = new Date(depDate);
    const arr = new Date(arrDate);
    const durationMs = arr - dep;
    const durationH = Math.floor(durationMs / 3600000);
    const durationM = Math.round((durationMs % 3600000) / 60000);

    const depDay = depDate.slice(0, 10);
    const arrDay = arrDate.slice(0, 10);
    const dayOffset = depDay !== arrDay ? 1 : 0;

    flights.push({
      airline: 'Ryanair',
      airlineCode: 'FR',
      flightNumber: '',
      origin,
      destination,
      departureTime: depDate,
      arrivalTime: arrDate,
      duration: `${durationH}u ${durationM}m`,
      durationMinutes: Math.round(durationMs / 60000),
      stops: 0,
      stopCities: [],
      price: fare.price.value,
      currency: fare.price.currencyCode || 'EUR',
      dayOffset,
      source: 'ryanair',
      fareDate: fare.day,
    });
  }

  // Filter to only the requested date
  const targetDate = dateOut.slice(0, 10);
  const matchingFlights = flights.filter(f => f.fareDate === targetDate);

  // If exact date match, return those; otherwise return all available in the month
  return matchingFlights.length > 0 ? matchingFlights : flights;
}

export function parseRyanairResults(flights) {
  return flights;
}
