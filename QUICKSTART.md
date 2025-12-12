# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Start the Application
```bash
npm run dev
```

This starts both:
- Backend server on `http://localhost:5000`
- Frontend app on `http://localhost:3000`

### Step 3: Open Your Browser
Navigate to `http://localhost:3000` and start shortening URLs!

## 📝 Important Notes

### Database Setup
- **No database URL needed!** The app uses SQLite by default
- Database file is automatically created at `server/data/bityly.db`
- No external database installation required

### Environment Variables
- **Optional**: Create `server/.env` if you want to customize the port
- Default port is 5000 (backend) and 3000 (frontend)
- See `server/.env.example` for configuration options

### Troubleshooting

**Port already in use?**
- Change `PORT` in `server/.env` or kill the process using port 5000

**Dependencies not installing?**
- Make sure you have Node.js v14+ installed
- Try deleting `node_modules` folders and running `npm run install-all` again

**Database errors?**
- Make sure the `server/data/` directory is writable
- Check that SQLite3 installed correctly: `npm list sqlite3` in server directory

## 🎯 Usage

1. Paste a long URL
2. (Optional) Click "Custom Code" to set your own short code
3. (Optional) Click "Expire/Limit" to set an expiry date or max clicks
4. Click "Shorten URL"
5. Copy and share your shortened link!

Short URLs work like: `http://localhost:5000/your-code`

