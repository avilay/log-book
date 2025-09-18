# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Log-book is a personal activity logging application that allows users to record and track their daily activities. The application follows a modern full-stack architecture with separate frontend and backend services.

**Key Features:**
- Activity logging with timestamps
- Firebase authentication (Google sign-in and anonymous)
- Historical data viewing and editing
- Mobile-responsive design
- Demo data generation for exploration

## Architecture Overview

The project follows a **client-server architecture** with these main components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (SvelteKit)                     │
│                    Static files served by Nginx                    │
│                         Port: 5173 (dev)                          │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ HTTP/HTTPS API calls
                          │ Firebase ID Token Auth
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Backend (FastAPI)                           │
│                    Reverse proxied by Nginx                        │
│                         Port: 8000                                 │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ SQL queries
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       SQLite Database                              │
│                     logbook-1.0.0.db                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (web/)
- **Framework**: SvelteKit 2.x with TypeScript
- **Styling**: SCSS with component-based styles
- **Build Tool**: Vite
- **Deployment**: Static files built with `@sveltejs/adapter-static`
- **Authentication**: Firebase Client SDK
- **State Management**: Svelte 5 runes (`$state`, `$props`)

### Backend (api/)
- **Framework**: FastAPI with Python 3.13
- **Database**: SQLite with direct SQL queries
- **Authentication**: Firebase Admin SDK for ID token verification
- **Package Management**: uv (modern Python package manager)
- **Logging**: Python logging with configurable file output
- **CORS**: Enabled for cross-origin requests

### Infrastructure
- **Web Server**: Nginx (reverse proxy for API, static file serving for frontend)
- **Process Management**: systemd service for production API deployment
- **SSL**: Let's Encrypt certificates managed by certbot
- **Development**: Automated startup/shutdown scripts for local development

## Directory Structure

```
log-book/
├── api/                          # Backend FastAPI application
│   ├── log_book/                 # Python package
│   │   ├── app.py                # FastAPI main application
│   │   ├── log.py                # Log model and service classes
│   │   └── __init__.py
│   ├── .env                      # Environment variables (DB path, Firebase)
│   ├── fb_key.json               # Firebase service account credentials
│   ├── logbook-1.0.0.db         # SQLite database
│   ├── logbook-api.service       # systemd service configuration
│   ├── nginx.conf                # Nginx reverse proxy config
│   └── uvicorn_logger.ini        # Logging configuration
├── web/                          # Frontend SvelteKit application
│   ├── src/
│   │   ├── routes/               # SvelteKit file-based routing
│   │   │   ├── +layout.svelte    # Main app layout with navigation
│   │   │   ├── +page.svelte      # Landing page with auth
│   │   │   ├── account/          # User account management
│   │   │   ├── history/          # Log viewing and editing
│   │   │   ├── insights/         # Analytics (placeholder)
│   │   │   └── new-log/          # Log creation form
│   │   ├── lib/
│   │   │   ├── firebase-client.ts # Firebase client initialization
│   │   │   └── index.ts          # Utility functions (date formatting)
│   │   └── styles/               # SCSS styling system
│   │       ├── _vars.scss        # Design system variables
│   │       ├── _main.scss        # Base styles
│   │       └── _*_button.scss    # Button variants
│   ├── static/                   # Static assets
│   ├── .env                      # Environment variables (API URL, Firebase keys)
│   ├── package.json              # Node.js dependencies
│   ├── svelte.config.js          # SvelteKit configuration
│   ├── vite.config.ts            # Vite build configuration
│   └── nginx.conf                # Nginx static file serving config
├── nginx-prod/                   # Production Nginx configurations
├── startup_dev.py                # Development environment startup script
├── shutdown_dev.py               # Development environment shutdown script
├── pyproject.toml                # Python project configuration
└── README.md                     # Comprehensive setup and deployment guide
```

## Data Model

### Database Schema
```sql
CREATE TABLE logs (
    log_id CHAR(22) PRIMARY KEY,     -- Short UUID
    user_id CHAR(28),                -- Firebase user ID
    created_at_utc TEXT,             -- ISO datetime string
    activity TEXT                    -- User-provided activity description
);
```

### API Models (Pydantic)
```python
class Log(BaseModel):
    user_id: str | None = None       # Set server-side
    log_id: str | None = None        # Generated server-side
    created_at_utc: datetime         # Must be UTC timezone
    activity: str                    # User input
```

## Authentication Flow

1. **Frontend**: User signs in via Firebase (Google OAuth or anonymous)
2. **ID Token**: Firebase generates JWT ID token client-side
3. **API Requests**: Frontend sends ID token in `X-Token` header
4. **Verification**: Backend verifies token with Firebase Admin SDK
5. **User Context**: Extracted `uid` used for data isolation

## API Endpoints

| Method | Endpoint        | Description                      | Auth Required |
|--------|-----------------|----------------------------------|---------------|
| GET    | `/version`      | API version                      | No            |
| GET    | `/logs`         | Get user's logs                  | Yes           |
| POST   | `/logs`         | Create new log                   | Yes           |
| PUT    | `/logs`         | Update existing log              | Yes           |
| DELETE | `/logs/{id}`    | Delete log by ID                 | Yes           |
| GET    | `/gen-demo`     | Generate demo data               | Yes           |

## Development Workflow

### Quick Start
```bash
# Start both servers automatically
./startup_dev.py

# Stop both servers
./shutdown_dev.py
```

The startup script:
- Detects your local IP address
- Updates `web/.env` to point to local API
- Opens new terminal tabs for web and API servers
- Makes both accessible from mobile devices on local network

### Manual Development
```bash
# Frontend
cd web
npm run dev -- --host 0.0.0.0

# Backend
cd api/log_book
source ../../.venv/bin/activate
fastapi dev app.py --host 0.0.0.0
```

### Python Environment
- Uses `uv` for fast dependency management
- Virtual environment in `.venv/`
- Python 3.13+ required
- Dependencies defined in `pyproject.toml`

### Frontend Development
- Hot reload enabled via Vite
- TypeScript strict mode
- ESLint and Prettier configured
- SCSS compilation built-in

## Deployment Architecture

### Production Environment
- **Domain**: logbook.avilay.rocks (frontend), logbook-api.avilay.rocks (backend)
- **SSL**: Let's Encrypt certificates with automatic renewal
- **Process Management**: systemd service for FastAPI backend
- **Web Server**: Nginx for static files and reverse proxy

### Build Process
```bash
# Frontend build (generates static files)
cd web && npm run build

# Backend runs directly from source with uv/virtualenv
cd api && systemctl start logbook-api
```

### Configuration Files
- `api/logbook-api.service`: systemd service definition
- `nginx-prod/*.conf`: Production Nginx configurations
- Environment variables in `.env` files (not tracked in git)

## Key Patterns and Conventions

### Frontend (SvelteKit)
- **File-based routing**: Routes in `src/routes/` map to URLs
- **Layout system**: `+layout.svelte` provides consistent navigation
- **Component composition**: Separate components for different view states
- **State management**: Svelte 5 runes for reactive state
- **Styling**: SCSS with component-scoped styles and shared variables

### Backend (FastAPI)
- **Dependency injection**: Firebase auth verification as dependency
- **Pydantic models**: Type-safe request/response handling
- **Error handling**: Global middleware for consistent error responses
- **Logging**: Structured logging with configurable output
- **Database**: Direct SQLite queries (no ORM), connection per service instance

### Authentication
- **Stateless**: No server-side sessions, JWT verification per request
- **User isolation**: All data queries filtered by Firebase `uid`
- **Token validation**: Firebase Admin SDK handles signature verification

### Code Organization
- **Backend**: Service classes for business logic, minimal controllers
- **Frontend**: Page components orchestrate data fetching and state
- **Shared utilities**: Date formatting and API communication helpers
- **Styling system**: Consistent design tokens and component patterns

## Common Development Tasks

### Adding New API Endpoint
1. Add route handler in `api/log_book/app.py`
2. Include authentication via `x_token` header parameter
3. Verify Firebase ID token to get user ID
4. Add business logic to appropriate service class
5. Update frontend API calls in relevant Svelte components

### Adding New Frontend Route
1. Create `+page.svelte` in `src/routes/new-route/`
2. Add navigation link in `+layout.svelte` if needed
3. Implement authentication check with `onAuthStateChanged`
4. Add API integration using fetch with X-Token header
5. Style using existing SCSS patterns and variables

### Database Schema Changes
1. Update SQLite database manually or via migration script
2. Modify Pydantic models in `log.py`
3. Update service layer methods for new schema
4. Adjust frontend TypeScript interfaces if needed

### Configuration Updates
1. Environment variables in `.env` files
2. Build configuration in `vite.config.ts` or `svelte.config.js`
3. Deployment configs in systemd service and Nginx conf files
4. Firebase configuration in both client and server initialization

This architecture provides a solid foundation for a personal logging application with room for growth while maintaining simplicity and clear separation of concerns.
- No need to check for Python syntax errors with py_compile.