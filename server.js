import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { searchAllFlights } from './api/flights.js';
import { searchRyanairFlights, getCheapestFares, getRoutes } from './api/ryanair.js';
import { getBookingUrl } from './api/deeplinks.js';
import { searchAirports } from './api/airports.js';
import { getBaggageInfo, AIRLINE_BAGGAGE } from './api/baggage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Simple in-memory user store (in productie: database)
const users = new Map();
const sessions = new Map();

function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

// Auth routes
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Vul alle velden in.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Wachtwoord moet minimaal 6 tekens zijn.' });
  }
  if (users.has(email)) {
    return res.status(409).json({ error: 'Dit e-mailadres is al geregistreerd.' });
  }

  users.set(email, { name, email, password });
  const token = generateToken();
  sessions.set(token, { email, name });

  res.json({ token, user: { name, email } });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'E-mailadres of wachtwoord is onjuist.' });
  }

  const token = generateToken();
  sessions.set(token, { email: user.email, name: user.name });

  res.json({ token, user: { name: user.name, email: user.email } });
});

app.get('/api/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = sessions.get(token);
  if (!session) return res.status(401).json({ error: 'Niet ingelogd.' });
  res.json({ user: session });
});

// Baggage info per airline
app.get('/api/baggage/:airline', (req, res) => {
  const info = getBaggageInfo(req.params.airline);
  if (!info) return res.status(404).json({ error: 'Maatschappij niet gevonden.' });
  res.json(info);
});

app.get('/api/baggage', (req, res) => {
  res.json(AIRLINE_BAGGAGE);
});

// Airport search (autocomplete)
app.get('/api/airports', (req, res) => {
  const { q } = req.query;
  const results = searchAirports(q || '');
  res.json(results);
});

// Flight search
app.get('/api/flights', async (req, res) => {
  const { origin, destination, dateOut, dateIn, adults, children } = req.query;

  if (!origin || !destination || !dateOut) {
    return res.status(400).json({ error: 'origin, destination en dateOut zijn verplicht.' });
  }

  try {
    const results = await searchAllFlights({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      dateOut,
      dateIn: dateIn || null,
      adults: parseInt(adults) || 1,
      children: parseInt(children) || 0,
    });
    res.json(results);
  } catch (err) {
    console.error('Flight search error:', err);
    res.status(500).json({ error: 'Zoeken mislukt. Probeer opnieuw.' });
  }
});

// Ryanair-only: cheapest fares per day
app.get('/api/ryanair/cheapest', async (req, res) => {
  const { origin, destination, month } = req.query;
  if (!origin || !destination || !month) {
    return res.status(400).json({ error: 'origin, destination en month zijn verplicht.' });
  }
  try {
    const data = await getCheapestFares(origin.toUpperCase(), destination.toUpperCase(), month);
    res.json(data);
  } catch (err) {
    console.error('Ryanair fares error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ryanair routes from airport
app.get('/api/ryanair/routes/:airport', async (req, res) => {
  try {
    const data = await getRoutes(req.params.airport.toUpperCase());
    const routes = data.map(r => ({
      code: r.arrivalAirport?.code,
      name: r.arrivalAirport?.name,
      country: r.arrivalAirport?.country?.name,
    }));
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Direct booking redirect — user stays logged in, goes straight to airline
app.get('/api/book', (req, res) => {
  const { airline, origin, destination, dateOut, dateIn, adults, children } = req.query;
  if (!airline || !origin || !destination || !dateOut) {
    return res.status(400).json({ error: 'Missende parameters.' });
  }

  const bookingUrl = getBookingUrl(airline, {
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    dateOut, dateIn: dateIn || null,
    adults: parseInt(adults) || 1,
    children: parseInt(children) || 0,
  });

  if (!bookingUrl) {
    return res.status(400).json({ error: 'Onbekende maatschappij.' });
  }

  res.json({ bookingUrl, airline });
});

app.listen(PORT, () => {
  console.log(`FlyBudget server draait op http://localhost:${PORT}`);
  console.log(`SerpApi key: ${process.env.SERPAPI_KEY ? 'ingesteld' : 'NIET ingesteld (alleen Ryanair beschikbaar)'}`);
});
