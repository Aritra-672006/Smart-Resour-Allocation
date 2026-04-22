# Smart Resource Allocation

A full-stack-ready React frontend for coordinating humanitarian aid — connecting NGOs, volunteers, and communities to direct resources where they're needed most.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 18 + Vite 5                   |
| Styling     | Tailwind CSS 3                      |
| Routing     | React Router v6                     |
| HTTP        | Axios                               |
| Charts      | Chart.js + react-chartjs-2          |
| Maps        | Leaflet.js + react-leaflet          |
| Fonts       | Syne (display) + DM Sans (body)     |

---

## Project Structure

```
smart-resource-allocation/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Router + layout shell
    ├── index.css              # Tailwind + global styles
    │
    ├── pages/
    │   ├── LandingPage.jsx    # Hero, stats, feature cards, CTAs
    │   ├── NGOUploadPage.jsx  # NGO report form → POST /upload-report
    │   ├── VolunteerPage.jsx  # Volunteer registration → POST /register-volunteer
    │   ├── DashboardPage.jsx  # Needs cards + Bar/Doughnut charts
    │   ├── TaskPage.jsx       # Task board with accept button
    │   └── MapPage.jsx        # Leaflet map with CircleMarkers
    │
    ├── components/
    │   ├── Navbar.jsx         # Sticky responsive navigation
    │   ├── NeedCard.jsx       # Urgency-colored need display card
    │   ├── TaskCard.jsx       # Task card with accept + progress bar
    │   ├── PageHeader.jsx     # Reusable page title + subtitle
    │   ├── StatusBanner.jsx   # Success / error / info alerts
    │   └── Spinner.jsx        # Loading indicator
    │
    ├── hooks/
    │   └── useFetch.js        # Generic data-fetching hook with fallback
    │
    └── utils/
        ├── api.js             # Axios instance + interceptors
        ├── mockData.js        # Demo data (used when API is down)
        └── urgency.js         # Urgency color helpers + number formatting
```

---

## Getting Started

### 1. Install dependencies

```bash
cd smart-resource-allocation
npm install
```

### 2. Configure the API base URL (optional)

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

If you skip this, it defaults to `http://localhost:8000`. When the API is unreachable, all pages fall back to built-in mock data automatically — so the app is fully usable in demo mode with no backend.

### 3. Start the dev server

```bash
npm run dev
```

Visit **http://localhost:5173**

### 4. Build for production

```bash
npm run build
npm run preview   # preview the build locally
```

---

## API Endpoints Expected

| Method | Endpoint            | Purpose                          |
|--------|---------------------|----------------------------------|
| POST   | `/upload-report`    | Submit NGO field report (multipart/form-data) |
| POST   | `/register-volunteer` | Register a volunteer           |
| GET    | `/community-needs`  | Fetch all active community needs |
| GET    | `/assignments`      | Fetch open volunteer task assignments |
| POST   | `/accept-task/:id`  | Accept a volunteer task          |

### Expected response shapes

**GET /community-needs**
```json
[
  {
    "id": 1,
    "need_type": "Food & Nutrition",
    "location": "Sundarbans Delta, WB",
    "urgency": "high",
    "people_affected": 1200,
    "lat": 21.9497,
    "lng": 88.9264,
    "description": "Flooding has cut off food supply routes."
  }
]
```

**GET /assignments**
```json
[
  {
    "id": "T-001",
    "title": "Food Distribution Drive",
    "location": "Sundarbans Delta, WB",
    "urgency": "high",
    "date": "2025-04-20",
    "duration": "6 hrs",
    "skills_needed": ["Logistics", "Driving"],
    "volunteers_needed": 12,
    "volunteers_assigned": 7,
    "description": "Organize and distribute food packets.",
    "status": "open"
  }
]
```

---

## Pages Overview

| Route        | Page                  | Description                                     |
|--------------|-----------------------|-------------------------------------------------|
| `/`          | Landing Page          | Hero section, stats, feature overview, CTAs     |
| `/upload`    | NGO Upload            | Form: ngo_name, location, report_text, people_affected, file |
| `/volunteer` | Volunteer Registration| Form: name, phone, skills (multi-select), location, availability |
| `/dashboard` | Needs Dashboard       | Stat cards, Bar chart, Doughnut chart, filterable NeedCard grid |
| `/tasks`     | Task Board            | Searchable, filterable TaskCard grid with accept button |
| `/map`       | Map Visualization     | Leaflet map with CircleMarkers sized by impact + sidebar |

---

## Urgency Color System

| Urgency | Color  | Usage                      |
|---------|--------|----------------------------|
| High    | Red    | `bg-red-500`, `text-red-400` |
| Medium  | Amber  | `bg-amber-500`, `text-amber-400` |
| Low     | Green  | `bg-forest-500`, `text-forest-400` |

---

## Demo Mode

All pages include fallback mock data (defined in `src/utils/mockData.js`). If the backend API is unreachable, the app loads demo data silently and shows a non-blocking info banner. This makes the frontend fully presentable without a running server.

---

## Customization

- **API URL** → `.env` → `VITE_API_URL`
- **Mock data** → `src/utils/mockData.js`
- **Colors** → `tailwind.config.js` (forest, urgency palettes)
- **Fonts** → `index.html` Google Fonts link + `tailwind.config.js` `fontFamily`
- **Map center/zoom** → `MapPage.jsx` `<MapContainer center=... zoom=...>`
