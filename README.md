# 🔗 shurt
🟠 Simple, minimal URL shortener built with Node.js, Express, SQLite and Tailwind CSS.

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)
![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind-38bdf8)
### Features
- Shorten long URLs
- Generate unique short codes
- Redirect short URLs to the original address
- Count clicks
- Display creation date
- Delete shortened URLs
- Persist data with SQLite

### Tech stack
- HTML
- Tailwind CSS
- Vanilla JavaScript
- NodeJS
- Express
- SQLite

---
### Screenshot
<img width="1226" height="763" alt="image" src="https://github.com/user-attachments/assets/3c355b1b-69a9-4b3d-8b33-f11308c74358" />

---

### Installation
Clone the repository:
```
git clone https://github.com/ccsgg/shurt.git
cd shurt
```
Install dependencies:
```
npm install
```
---
### Development
Start the Express server:
```
npm start
```
Start Tailwind CSS in watch mode:
```
npm run tailwind
```
Or, if you configured ***concurrently***:
```
npm run dev
```
Then open:
```
http://localhost:3000
```
---
### API routes
```
POST   /api/shorten
GET    /api/urls
DELETE /api/urls/:id
GET    /:code
```

POST ```/api/shorten```

Creates a shortened URL.

Example request:
```json
{
  "url": "https://example.com/a-very-long-url"
}
```
Example response:
```json
{
  "id": 1,
  "original_url": "https://example.com/a-very-long-url",
  "short_url": "abc123"
}
```
---
### Database
The project uses SQLite with a table similar to:
```sql
CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_url TEXT NOT NULL,
  short_url TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
---
### 🟠 Possible future improvements
- Custom short codes
- URL expiration
- Edit existing URLs
- Statistics page
- QR codes
- Authentication
- Deployment
