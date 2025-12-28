# SnapLink - URL Shortener

A responsive, full-stack URL shortener application built with React and Node.js, inspired by Bitly.

## Features

- ✨ Shorten long URLs into compact, shareable links
- 🎨 Modern, responsive UI design
- 📊 Click tracking and statistics
- 🔗 Custom URL codes support
- ⏳ Smart link expiry (time-based) and click caps (auto-deactivate after N clicks)
- 💾 SQLite database (no external database setup required)
- 🚀 Fast and lightweight

## Tech Stack

- **Frontend**: React 18, CSS3
- **Backend**: Node.js, Express
- **Database**: SQLite (default, can be configured for PostgreSQL/MongoDB)
- **Package Manager**: npm

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation & Setup

### 1. Install Dependencies

Run the following command from the project root to install all dependencies:

```bash
npm run install-all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Backend server
- Frontend client

### 2. Environment Configuration

The application uses SQLite by default, so **no database URL configuration is needed** for basic setup. The database file will be automatically created in `server/data/snaplink.db`.

If you want to use a different database (PostgreSQL or MongoDB), you can configure it in `server/.env`:

```bash
cd server
cp .env.example .env
```

Then edit `server/.env` and uncomment/configure the database settings you need.

### 3. Start the Application

From the project root, run:

```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

Alternatively, you can run them separately:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Paste a long URL in the input field
3. Optionally, click "Custom Code" to set a custom short code
4. (Optional) Click "Expire/Limit" to set an expiration date or max clicks
5. Click "Shorten URL"
6. Copy and share your shortened URL!

## API Endpoints

### POST `/api/urls/shorten`
Create a new short URL
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customCode": "optional-custom-code"
}
```

### GET `/api/urls`
Get all shortened URLs (with limit query param)

### GET `/api/urls/:code`
Get URL details by short code

### GET `/api/urls/:code/redirect`
Redirect to original URL (increments click count)

### GET `/api/urls/:code/stats`
Get statistics for a short URL

## Project Structure

```
bityly/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Express backend
│   ├── data/              # SQLite database (auto-created)
│   ├── routes/            # API routes
│   ├── database.js        # Database configuration
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Database Setup

### SQLite (Default - No Setup Required)

The application uses SQLite by default. The database file is automatically created at `server/data/bityly.db` when you first run the server. **No additional configuration needed!**

### PostgreSQL (Optional)

If you want to use PostgreSQL instead:

1. Install PostgreSQL and create a database
2. Update `server/.env`:
   ```
   DB_TYPE=postgresql
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bityly
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```
3. Update `server/database.js` to use PostgreSQL client (pg)

### MongoDB (Optional)

If you want to use MongoDB:

1. Install MongoDB and start the service
2. Update `server/.env`:
   ```
   DB_TYPE=mongodb
   DB_CONNECTION_STRING=mongodb://localhost:27017/bityly
   ```
3. Update `server/database.js` to use MongoDB client (mongodb)

## Environment Variables

Create `server/.env` file (optional, defaults work fine):

```env
PORT=5000
BASE_URL=http://localhost:5000
```

For frontend, create `client/.env` (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Building for Production

To build the frontend for production:

```bash
cd client
npm run build
```

The production build will be in `client/build/`.

## License

MIT

## Notes

- The SQLite database is stored in `server/data/` directory
- Short codes are generated using nanoid (8 characters by default)
- Click tracking is automatically updated when URLs are accessed via the redirect endpoint
- Links can be auto-deactivated if they reach their expiry date or max clicks
- The application is fully responsive and works on mobile devices

