const SERPAPI_KEY = process.env.SERPAPI_KEY || '';

export async function searchGoogleFlights(origin, destination, dateOut, dateIn, adults = 1, children = 0) {
  if (!SERPAPI_KEY) {
    return { error: 'SERPAPI_KEY niet ingesteld. Registreer op serpapi.com voor een gratis API key.' };
  }

  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_flights');
  url.searchParams.set('departure_id', origin);
  url.searchParams.set('arrival_id', destination);
  url.searchParams.set('outbound_date', dateOut);
  if (dateIn) url.searchParams.set('return_date', dateIn);
  url.searchParams.set('type', dateIn ? '1' : '2'); // 1=roundtrip, 2=oneway
  url.searchParams.set('adults', adults);
  url.searchParams.set('children', children);
  url.searchParams.set('currency', 'EUR');
  url.searchParams.set('hl', 'nl');
  url.searchParams.set('gl', 'nl');
  url.searchParams.set('api_key', SERPAPI_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SerpApi ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

export function parseSerpApiResults(data, filterAirlines = []) {
  const flights = [];
  const buckets = [
    ...(data.best_flights || []),
    ...(data.other_flights || []),
  ];

  for (const option of buckets) {
    const legs = option.flights || [];
    if (!legs.length) continue;

    const first = legs[0];
    const last = legs[legs.length - 1];
    const airline = first.airline;
    const airlineCode = first.airline_logo ? '' : '';

    if (filterAirlines.length > 0) {
      const matchesFilter = legs.some(leg =>
        filterAirlines.some(a => leg.airline?.toLowerCase().includes(a.toLowerCase()))
      );
      if (!matchesFilter) continue;
    }

    const stops = legs.length - 1;
    const stopCities = legs.length > 1
      ? legs.slice(0, -1).map(l => l.arrival_airport?.id || l.arrival_airport?.name)
      : [];

    const durationMin = option.total_duration || 0;
    const durationH = Math.floor(durationMin / 60);
    const durationM = durationMin % 60;

    flights.push({
      airline: first.airline,
      airlineCode: extractIATA(first),
      flightNumber: first.flight_number || '',
      origin: first.departure_airport?.id,
      destination: last.arrival_airport?.id,
      departureTime: first.departure_airport?.time,
      arrivalTime: last.arrival_airport?.time,
      duration: `${durationH}u ${durationM}m`,
      durationMinutes: durationMin,
      stops,
      stopCities,
      price: option.price,
      currency: 'EUR',
      source: 'google_flights',
      carbonEmissions: option.carbon_emissions?.this_flight,
      airlineLogo: first.airline_logo,
    });
  }
  return flights;
}

function extractIATA(leg) {
  const fn = leg.flight_number || '';
  const match = fn.match(/^([A-Z]{2})/);
  return match ? match[1] : '';
}
