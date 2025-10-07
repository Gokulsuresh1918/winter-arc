@echo off
echo Creating .env file from env.example...

if exist .env (
    echo .env file already exists!
    set /p overwrite="Do you want to overwrite it? (y/n): "
    if /i "%overwrite%"=="y" (
        copy /Y env.example .env
        echo .env file has been overwritten!
    ) else (
        echo Keeping existing .env file.
    )
) else (
    copy env.example .env
    echo .env file created successfully!
)

echo.
echo ✅ Environment setup complete!
echo.
echo Next steps:
echo 1. Edit .env file to configure your backend URL
echo 2. Run 'npm run dev' to start the development server
echo.
pause

