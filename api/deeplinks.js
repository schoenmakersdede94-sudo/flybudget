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

export function getKLMBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const pax = [];
  for (let i = 0; i < adults; i++) pax.push(`${pax.length + 1}:ADT`);
  for (let i = 0; i < children; i++) pax.push(`${pax.length + 1}:CHD`);
  const params = new URLSearchParams({
    activeConnection: '0',
    cabinClass: 'ECONOMY',
    lang: 'nl',
    country: 'NL',
    origin,
    destination,
    outDate: dateOut,
  });
  params.set('pax', pax.join(','));
  if (dateIn) params.set('inDate', dateIn);
  return `https://www.klm.nl/search/offer?${params}`;
}

export function getTransaviaBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    routeSelection: `${origin}-${destination}`,
    dateSelection: dateOut,
    adultCount: adults,
    childCount: children,
    infantCount: 0,
  });
  if (dateIn) params.set('returnDateSelection', dateIn);
  return `https://www.transavia.com/nl-NL/boek-een-vlucht/vluchten/zoek/?${params}`;
}

export function getEasyJetBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    origin,
    destination,
    oday: dateOut.split('-')[2],
    omonth: dateOut.split('-')[1],
    oyear: dateOut.split('-')[0],
    adults,
    children,
    infants: 0,
  });
  if (dateIn) {
    params.set('iday', dateIn.split('-')[2]);
    params.set('imonth', dateIn.split('-')[1]);
    params.set('iyear', dateIn.split('-')[0]);
  }
  return `https://www.easyjet.com/nl/search?${params}`;
}

export function getWizzAirBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  let url = `https://wizzair.com/nl-nl/booking/select-flight/${origin}/${destination}/${dateOut}`;
  url += dateIn ? `/${dateIn}` : '/null';
  url += `/${adults}/${children}/0/null`;
  return url;
}

export function getNorwegianBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    AdultCount: adults,
    ChildCount: children,
    InfantCount: 0,
    Origin: origin,
    Destination: destination,
    OutDate: dateOut,
    Direction: dateIn ? 'Return' : 'Oneway',
  });
  if (dateIn) params.set('InDate', dateIn);
  return `https://www.norwegian.com/nl/booking/fly/offers?${params}`;
}

export function getTAPBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    from: origin,
    to: destination,
    departureDate: dateOut,
    adults,
    children,
    infants: 0,
    type: dateIn ? 'return' : 'oneway',
    cabinClass: 'economy',
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.flytap.com/nl-nl/search-flights?${params}`;
}

export function getIberiaBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    market: 'NL',
    language: 'nl',
    adults,
    children,
    infants: 0,
    from: origin,
    to: destination,
    departureDate: dateOut,
    tripType: dateIn ? 'RT' : 'OW',
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.iberia.com/nl/flights/?${params}`;
}

export function getTurkishBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    departureAirport: origin,
    arrivalAirport: destination,
    departureDateTimeOutbound: dateOut,
    adultPassengerCount: adults,
    childPassengerCount: children,
    infantPassengerCount: 0,
    isRoundTrip: dateIn ? 'true' : 'false',
    languageCode: 'nl',
  });
  if (dateIn) params.set('departureDateTimeInbound', dateIn);
  return `https://www.turkishairlines.com/nl-nl/flights/flight-results/?${params}`;
}

export function getLufthansaBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    bookingClass: 'ECONOMY',
    departureSite: origin,
    returnSite: destination,
    travelDate: dateOut,
    ADULT: adults,
    CHILD: children,
    INFANT: 0,
    tripType: dateIn ? 'R' : 'O',
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.lufthansa.com/nl/nl/select-flights?${params}`;
}

export function getAirFranceBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const pax = [];
  for (let i = 0; i < adults; i++) pax.push(`${pax.length + 1}:ADT`);
  for (let i = 0; i < children; i++) pax.push(`${pax.length + 1}:CHD`);
  const params = new URLSearchParams({
    activeConnection: '0',
    cabinClass: 'ECONOMY',
    lang: 'nl',
    origin,
    destination,
    outDate: dateOut,
  });
  params.set('pax', pax.join(','));
  if (dateIn) params.set('inDate', dateIn);
  return `https://wwws.airfrance.nl/search/offer?${params}`;
}

export function getSwissBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    bookingClass: 'economy',
    origin,
    destination,
    travelDate: dateOut,
    adults,
    children,
    infants: 0,
    tripType: dateIn ? 'RT' : 'OW',
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.swiss.com/nl/nl/book/offers?${params}`;
}

export function getBrusselsAirlinesBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    adults,
    children,
    infants: 0,
    origin,
    destination,
    outDate: dateOut,
    tripType: dateIn ? 'RT' : 'OW',
  });
  if (dateIn) params.set('inDate', dateIn);
  return `https://www.brusselsairlines.com/nl/nl/booking/select-flights?${params}`;
}

export function getSASBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    Origin: origin,
    Destination: destination,
    OutDate: dateOut,
    ADT: adults,
    CHD: children,
    INF: 0,
    Type: dateIn ? 'RT' : 'OW',
  });
  if (dateIn) params.set('InDate', dateIn);
  return `https://www.flysas.com/nl-nl/book/flights?${params}`;
}

export function getPegasusBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    from: origin,
    to: destination,
    departureDate: dateOut,
    adult: adults,
    child: children,
    infant: 0,
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.flypgs.com/nl/goedkope-vliegtickets?${params}`;
}

export function getAegeanBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    origin,
    destination,
    departDate: dateOut,
    adults,
    children,
    infants: 0,
    tripType: dateIn ? 'RoundTrip' : 'OneWay',
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://en.aegeanair.com/book/flight-search/?${params}`;
}

export function getVoloteaBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    from: origin,
    to: destination,
    outDate: dateOut,
    adults,
    children,
    infants: 0,
  });
  if (dateIn) params.set('inDate', dateIn);
  return `https://www.volotea.com/nl/booking/search?${params}`;
}

export function getAustrianBookingUrl({ origin, destination, dateOut, dateIn, adults = 1, children = 0 }) {
  const params = new URLSearchParams({
    bookingClass: 'ECONOMY',
    departureSite: origin,
    returnSite: destination,
    travelDate: dateOut,
    ADULT: adults,
    CHILD: children,
    INFANT: 0,
    tripType: dateIn ? 'R' : 'O',
  });
  if (dateIn) params.set('returnDate', dateIn);
  return `https://www.austrian.com/nl/nl/select-flights?${params}`;
}

// Google Flights fallback for any airline not in our list
export function getGoogleFlightsUrl({ origin, destination, dateOut, dateIn, adults = 1 }) {
  const params = new URLSearchParams({
    hl: 'nl',
    gl: 'nl',
    curr: 'EUR',
  });
  return `https://www.google.com/travel/flights?${params}&q=flights+from+${origin}+to+${destination}+on+${dateOut}`;
}

const AIRLINE_MAP = [
  { match: ['ryanair'], fn: getRyanairBookingUrl },
  { match: ['vueling'], fn: getVuelingBookingUrl },
  { match: ['eurowings'], fn: getEurowingsBookingUrl },
  { match: ['klm', 'royal dutch'], fn: getKLMBookingUrl },
  { match: ['transavia'], fn: getTransaviaBookingUrl },
  { match: ['easyjet', 'easy jet'], fn: getEasyJetBookingUrl },
  { match: ['wizz', 'wizzair'], fn: getWizzAirBookingUrl },
  { match: ['norwegian'], fn: getNorwegianBookingUrl },
  { match: ['tap portugal', 'tap air'], fn: getTAPBookingUrl },
  { match: ['iberia'], fn: getIberiaBookingUrl },
  { match: ['turkish'], fn: getTurkishBookingUrl },
  { match: ['lufthansa'], fn: getLufthansaBookingUrl },
  { match: ['air france'], fn: getAirFranceBookingUrl },
  { match: ['swiss international', 'swiss air', 'swiss '], fn: getSwissBookingUrl },
  { match: ['brussels airlines', 'brussels air'], fn: getBrusselsAirlinesBookingUrl },
  { match: ['sas ', 'scandinavian'], fn: getSASBookingUrl },
  { match: ['pegasus'], fn: getPegasusBookingUrl },
  { match: ['aegean'], fn: getAegeanBookingUrl },
  { match: ['volotea'], fn: getVoloteaBookingUrl },
  { match: ['austrian'], fn: getAustrianBookingUrl },
];

export function getBookingUrl(airline, searchParams) {
  const name = (airline || '').toLowerCase();
  for (const entry of AIRLINE_MAP) {
    if (entry.match.some(m => name.includes(m))) {
      return entry.fn(searchParams);
    }
  }
  // Fallback: Google Flights search
  return getGoogleFlightsUrl(searchParams);
}
