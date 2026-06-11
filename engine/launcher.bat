@echo off
setlocal enabledelayedexpansion
if exist "%~dp0\.env" (
  for /f "usebackq delims=" %%L in ("%~dp0\.env") do (
    set "line=%%L"
    if not "!line:~0,1!"=="#" if defined line (
      for /f "tokens=1,2 delims==" %%A in ("!line!") do set "%%A=%%B"
    )
  )
)
node "%~dp0main.js"
