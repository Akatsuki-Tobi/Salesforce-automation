@echo off
echo Closing any running Chrome instances...
taskkill /f /im chrome.exe 2>nul
echo.
echo Launching Chrome with remote debugging on port 9222...
start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\Users\MANIKANTA\AppData\Local\Google\Chrome\UserDataDebug" --remote-allow-origins=*
echo.
echo Chrome has been launched.
echo Please log in to Trailhead and launch the playground in the opened Chrome window.
echo.
pause
