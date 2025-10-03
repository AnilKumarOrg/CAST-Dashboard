# CAST DataMart Dashboard - Quick Start

## Running Both Servers with One Click

To start both the frontend and backend servers simultaneously, simply double-click the `start-dashboard.bat` file or run it from the command line.

### What the batch file does:
1. Starts the backend API server on port **8888**
2. Starts the frontend dashboard on port **9999**
3. Opens two separate command windows for each service

### Accessing the Dashboard:
- **Frontend Dashboard**: http://localhost:9999
- **Backend API**: http://localhost:8888

### Configuration:
The ports are configured in the `.env` file:
- `PORT=9999` - Frontend port
- `VITE_API_URL=http://localhost:8888` - Backend API URL

### Stopping the Servers:
- Close both command windows that opened when you ran the batch file
- Or press Ctrl+C in each window

### Manual Start (Alternative):
If you prefer to start servers manually:

1. **Backend Server:**
   ```bash
   set PORT=8888 && node server/index.js
   ```

2. **Frontend Dashboard:**
   ```bash
   set PORT=9999 && npm run dev
   ```

### Troubleshooting:
- Make sure ports 8888 and 9999 are not already in use
- Check that all dependencies are installed (`npm install`)
- Verify database connection settings in `.env` file