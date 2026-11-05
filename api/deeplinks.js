export function getRyanairBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    adults, teens: 0, children, infants: 0,
    dateOut,
    dateIn: dateIn || '',
    isConnectedFlight: 'false',
    discount: '0',
    isReturn: dateIn ? 'true' : 'false',
    promoCode: '',
    originIata: origin,
    destinationIata: destination,
  });
  return `https://www.ryanair.com/nl/nl/trip/flights/select?${params}`;
}

export function getVuelingBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    originAirport: origin,
    destinationAirport: destination,
    departureDate: dateOut,
    adults,
    children,
    infants: 0,
    culture: 'nl-NL',
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.vueling.com/nl/boek-uw-vlucht/select?${params}`;
}

export function getEurowingsBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    origin,
    destination,
    outboundDate: dateOut,
    adultCount: adults,
    childCount: children,
    infantCount: 0,
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.eurowings.com/nl-nl/booking/select.html?${params}`;
}

export function getBookingUrl(airline, searchParams) {
  const name = airline.toLowerCase();
  if (name.includes('ryanair')) return getRyanairBookingUrl(searchParams);
  if (name.includes('vueling')) return getVuelingBookingUrl(searchParams);
  if (name.includes('eurowings')) return getEurowingsBookingUrl(searchParams);
  return null;
}
