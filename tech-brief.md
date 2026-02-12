## Tech brief: Weather widget using Open‑Meteo on a static Vercel site

### Goal
Add a lightweight weather component to a plain HTML/CSS site hosted on Vercel that displays current conditions (and optionally a short forecast) using the **Open‑Meteo** API.

### Why Open‑Meteo
- **Free** and **no API key** required.
- Works well from the **client-side** (no secrets to protect).
- Supports **current weather** and **forecast** in one call.
- Global coverage.

### High-level architecture (client-only)
1. Determine a location:
   - **Fixed location** (hardcode lat/lon), or
   - **User location** via `navigator.geolocation`, with fallback to a default.
2. Fetch weather data from Open‑Meteo:
   - `https://api.open-meteo.com/v1/forecast?...`
3. Render into a widget container in the DOM.
4. Cache results (optional but recommended) using `localStorage` with a short TTL to reduce repeated calls.

### Data flow
Browser → (optional geolocation) → Open‑Meteo forecast endpoint → JSON → UI rendering

### Key API endpoints you’ll likely use
1) **Forecast / current conditions**  
`GET https://api.open-meteo.com/v1/forecast`
- Inputs: `latitude`, `longitude`
- Useful params:
  - `current=temperature_2m,weather_code,wind_speed_10m`
  - `daily=temperature_2m_max,temperature_2m_min,weather_code`
  - `timezone=auto`
  - `temperature_unit=fahrenheit|celsius`
  - `wind_speed_unit=mph|kmh`
  - `precipitation_unit=inch|mm`

2) (Optional) **Geocoding (city → lat/lon)**  
If you want users to type a city name instead of geolocation:
- Open‑Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api

### UI/UX considerations
- **Loading state** (“Loading weather…”)
- **Error state** (API failure, geolocation denied)
- **Permission prompt** (if using geolocation)
- **Accessibility**: semantic markup; avoid relying only on icons; use `aria-live` for updates.
- **Performance**: keep JS small; cache; avoid frequent polling.

### Security & privacy
- No secrets involved (no key).
- If using geolocation, you’re requesting sensitive info:
  - Ask only when needed (e.g., “Use my location” button).
  - Provide a fallback location.
  - Don’t store precise coordinates long-term unless you have a reason.

### Reliability notes
- Open‑Meteo is generally reliable, but treat it as an external dependency:
  - Add timeouts (or at least handle hung requests gracefully).
  - Use caching so brief outages don’t blank the widget.

---

## Step-by-step implementation plan

### Phase 1 — Define requirements (15–30 minutes)
1. Decide location mode:
   - A) **Fixed** (e.g., always Seattle), or
   - B) **User location** (geolocation), or
   - C) **City search** (geocoding).
2. Decide what to display:
   - “Now”: temp + condition text + wind
   - Optional: high/low today, 3–5 day forecast
3. Decide units:
   - Fahrenheit vs Celsius, mph vs km/h

Deliverable: a short spec (what fields, which location behavior, units).

---

### Phase 2 — Add HTML structure (10 minutes)
1. Add a widget container where it should appear.
2. Include placeholders for:
   - status line (loading/error)
   - current weather
   - optional forecast list

Example structure (you can adjust):
- `#weather`
  - `.weather__status`
  - `.weather__current`
  - `.weather__forecast`

Deliverable: HTML committed.

---

### Phase 3 — Add CSS styling (15–45 minutes)
1. Style for:
   - compact card layout
   - typography for temperature
   - responsive behavior (mobile)
2. Add classes for:
   - loading (dimmed)
   - error (alert color)
3. Ensure contrast and readable sizes.

Deliverable: widget looks good with mock data.

---

### Phase 4 — Implement the Open‑Meteo fetch (30–60 minutes)
1. Write a small JS module (inline `<script>` or separate `weather.js`) that:
   - builds the Open‑Meteo URL with desired params
   - fetches JSON
   - validates expected fields exist
2. Convert weather codes to human-friendly text:
   - Implement a `weatherCodeToText(code)` mapping (at least for common codes).
3. Render the UI:
   - set text content for temperature, condition, wind, etc.
   - render forecast rows if enabled

Deliverable: widget displays real data for a known lat/lon.

---

### Phase 5 — Add location handling (30–90 minutes)
Pick one:

**A) Fixed location**
- Hardcode coordinates in config (fastest).

**B) User geolocation**
1. Only request geolocation after user interaction (recommended):
   - Button: “Use my location”
2. If permission granted, fetch weather for coordinates.
3. If denied, fall back to default location and show a note.

**C) City search (geocoding)**
1. Add an input + submit.
2. Call Open‑Meteo geocoding API to get lat/lon.
3. Fetch weather and render.
4. Cache last successful city in `localStorage`.

Deliverable: chosen location mode works end-to-end.

---

### Phase 6 — Add caching + rate limiting (20–45 minutes)
1. Cache the last response in `localStorage`:
   - key: e.g. `weather_cache_{lat}_{lon}_{units}`
   - store: `{ timestamp, data }`
2. TTL suggestion:
   - current weather: 10–20 minutes
3. On load:
   - if cache fresh → render immediately
   - then optionally refresh in background

Deliverable: fast loads and fewer API calls.

---

### Phase 7 — Robustness & polish (30–60 minutes)
1. Error handling:
   - network failures
   - unexpected response shape
   - geolocation timeout
2. Add `aria-live="polite"` to status region for accessibility.
3. Add “Last updated” time (optional).
4. Test on mobile + desktop.

Deliverable: widget fails gracefully and is accessible.

---

### Phase 8 — Deploy on Vercel (5–15 minutes)
1. Commit changes.
2. Push to your repo.
3. Vercel auto-deploys.
4. Verify production behavior (especially geolocation on HTTPS—Vercel is HTTPS by default).

Deliverable: live widget.

---

## Implementation details I need from you to write the exact code plan
1) Do you want **fixed location** (which city) or **visitor location**?  
2) Do you want **current only** or include a **3–5 day forecast**?  
3) Fahrenheit or Celsius?  

If you answer those, I can tailor the brief into a concrete file-by-file plan (HTML snippet + CSS + a `weather.js` you can drop in).