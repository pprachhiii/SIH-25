@echo off
echo ====================================
echo Setting up all project environments
echo ====================================

echo.
echo [1/4] Setting up Django API environment...
cd /d "d:\git project\SIH 25\Nisemono\backend\django_api"
if exist venv (
    echo Removing existing virtual environment...
    rmdir /s /q venv
)
echo Creating new virtual environment...
python -m venv venv
echo Activating virtual environment...
call venv\Scripts\activate
echo Upgrading pip...
python -m pip install --upgrade pip
echo Installing requirements...
pip install -r requirements.txt
echo Testing Django setup...
python manage.py check
call venv\Scripts\deactivate

echo.
echo [2/4] Setting up AI Service environment...
cd /d "d:\git project\SIH 25\Nisemono\ai_service"
if exist venv (
    echo Removing existing virtual environment...
    rmdir /s /q venv
)
echo Creating new virtual environment...
python -m venv venv
echo Activating virtual environment...
call venv\Scripts\activate
echo Upgrading pip...
python -m pip install --upgrade pip
echo Installing requirements...
pip install -r requirements.txt
echo Testing FastAPI import...
python -c "import fastapi; print('FastAPI installed successfully')"
call venv\Scripts\deactivate

echo.
echo [3/4] Setting up Node.js services...
cd /d "d:\git project\SIH 25\Nisemono\backend\node_services\auth_service"
echo Installing auth service dependencies...
call npm install

cd /d "d:\git project\SIH 25\Nisemono\backend\node_services\blockchain_service"
echo Installing blockchain service dependencies...
call npm install

cd /d "d:\git project\SIH 25\Nisemono\backend\node_services\notification_service"
echo Installing notification service dependencies...
call npm install

echo.
echo [4/4] Setting up main project...
cd /d "d:\git project\SIH 25\Nisemono"
echo Installing main project dependencies...
call npm install

echo.
echo ====================================
echo All environments set up successfully!
echo ====================================
echo.
echo To activate environments:
echo - Django API: cd backend\django_api ^&^& venv\Scripts\activate
echo - AI Service: cd ai_service ^&^& venv\Scripts\activate
echo.
pause
