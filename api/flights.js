import { searchRyanairFlights } from './ryanair.js';
import { searchGoogleFlights, parseSerpApiResults } from './serpapi.js';
import { getBookingUrl } from './deeplinks.js';

export async function searchAllFlights({ origin, destination, dateOut, dateIn, adults, children }) {
  const results = { flights: [], errors: [], sources: [] };
  const searchParams = { origin, destination, dateOut, dateIn, adults, children };

  // Ryanair — direct fare finder API (gratis, geen key nodig)
  const ryanairPromise = searchRyanairFlights(origin, destination, dateOut, dateIn, adults, children)
    .then(flights => {
      if (flights.length > 0) results.sources.push('ryanair');
      return flights;
    })
    .catch(err => {
      results.errors.push({ source: 'ryanair', message: err.message });
      return [];
    });

  // SerpApi Google Flights — voor Vueling, Eurowings en overige
  const serpPromise = searchGoogleFlights(origin, destination, dateOut, dateIn, adults, children)
    .then(data => {
      if (data.error) {
        results.errors.push({ source: 'google_flights', message: data.error });
        return [];
      }
      results.sources.push('google_flights');
      return parseSerpApiResults(data);
    })
    .catch(err => {
      results.errors.push({ source: 'google_flights', message: err.message });
      return [];
    });

  const [ryanairFlights, serpFlights] = await Promise.all([ryanairPromise, serpPromise]);

  // Filter Ryanair duplicates from SerpApi results
  const serpWithoutRyanair = serpFlights.filter(f =>
    !f.airline?.toLowerCase().includes('ryanair')
  );

  results.flights = [...ryanairFlights, ...serpWithoutRyanair];

  // Build booking links for each flight
  const dateFormatted = dateOut;
  for (const flight of results.flights) {
    // Primary: Google Flights search URL (always works)
    const flt = dateIn
      ? `${origin}.${destination}.${dateOut}*${destination}.${origin}.${dateIn}`
      : `${origin}.${destination}.${dateOut}`;
    flight.googleUrl = `https://www.google.com/travel/flights?hl=nl&gl=nl&curr=EUR#flt=${flt}`;

    // Secondary: direct airline website
    flight.airlineUrl = getBookingUrl(flight.airline, searchParams);

    // Use Google Flights as primary booking link
    flight.bookingUrl = flight.googleUrl;
  }

  // Sort by price (cheapest first)
  results.flights.sort((a, b) => (a.price ?? 9999) - (b.price ?? 9999));

  // Mark the cheapest
  if (results.flights.length > 0 && results.flights[0].price != null) {
    results.flights[0].isCheapest = true;
  }

  return results;
}
