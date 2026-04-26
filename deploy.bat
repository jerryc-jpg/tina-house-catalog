@echo off
setlocal

set "SRC=C:\Users\jerry\my-app"
set "DEST=C:\Users\jerry\my-app\tina-house-static.zip"

cd /d "%SRC%"

if exist "%DEST%" (
    del /q "%DEST%"
    if exist "%DEST%" (
        echo.
        echo ERROR: Could not delete existing %DEST%.
        echo Close any program that has it open and try again.
        echo.
        pause
        exit /b 1
    )
)

"%SystemRoot%\System32\tar.exe" -a -c -f "%DEST%" ^
    index.html about.html brand.html brands.html ^
    haircare.html makeup.html skincare.html visit.html ^
    brands.json products.json ^
    css js images

if errorlevel 1 (
    echo.
    echo FAILED to create %DEST%.
    pause
    exit /b 1
)

for %%A in ("%DEST%") do set "ZIPSIZE=%%~zA"
echo.
echo Created %DEST%
echo Size:    %ZIPSIZE% bytes
echo.
pause
endlocal
