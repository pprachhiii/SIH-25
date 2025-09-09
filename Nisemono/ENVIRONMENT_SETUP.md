# Environment Setup Guide

## Virtual Environments Created

### 1. Django API (`backend/django_api/`)
- **Location**: `d:\git project\SIH 25\Nisemono\backend\django_api\venv`
- **Activation**: `.\venv\Scripts\activate`
- **Installed Packages**: Django 5.2.6, DRF, django-cors-headers, django-filter, drf-spectacular, celery, redis, etc.
- **Test Command**: `python manage.py check`

### 2. AI Service (`ai_service/`)
- **Location**: `d:\git project\SIH 25\Nisemono\ai_service\venv`
- **Activation**: `.\venv\Scripts\activate`
- **Installed Packages**: FastAPI, Google AI, uvicorn, pydantic, etc.
- **Test Command**: `python -c "import fastapi; print('FastAPI installed successfully')"`

### 3. Node.js Services
- **Auth Service**: `backend/node_services/auth_service/node_modules`
- **Blockchain Service**: `backend/node_services/blockchain_service/node_modules`
- **Notification Service**: `backend/node_services/notification_service/node_modules`
- **Main Project**: `node_modules`

## Quick Start Commands

### Start Django API
```powershell
cd "d:\git project\SIH 25\Nisemono\backend\django_api"
.\venv\Scripts\activate
python manage.py runserver
```

### Start AI Service
```powershell
cd "d:\git project\SIH 25\Nisemono\ai_service"
.\venv\Scripts\activate
uvicorn app:app --reload
```

### Start Node Services
```powershell
# Auth Service
cd "d:\git project\SIH 25\Nisemono\backend\node_services\auth_service"
npm start

# Blockchain Service
cd "d:\git project\SIH 25\Nisemono\backend\node_services\blockchain_service"
npm start

# Notification Service
cd "d:\git project\SIH 25\Nisemono\backend\node_services\notification_service"
npm start
```

## Automatic Setup
Run `setup_environments.bat` to automatically recreate all environments.

## VS Code Workspace Configuration
For each Python project, create `.vscode/settings.json`:

```json
{
    "python.defaultInterpreterPath": "./venv/Scripts/python.exe",
    "python.terminal.activateEnvironment": true
}
```
