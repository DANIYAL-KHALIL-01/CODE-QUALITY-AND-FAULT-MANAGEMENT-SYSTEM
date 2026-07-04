@echo off
echo ========================================
echo   PDF Conversion Helper
echo   Code Quality & Fault Prediction System
echo ========================================
echo.
echo This script will help you convert HTML documentation to PDF.
echo.
echo OPTION 1: Open all HTML files in browser (you convert manually)
echo OPTION 2: View conversion instructions
echo OPTION 3: Exit
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" goto open_browser
if "%choice%"=="2" goto show_instructions
if "%choice%"=="3" goto end

:open_browser
echo.
echo Opening HTML files in your default browser...
echo You can then use Ctrl+P to print each one to PDF.
echo.
start "" "Chapter-1-SPMP.html"
timeout /t 2 >nul
echo Opened Chapter 1 - SPMP
echo.
echo Press any key to open the next chapter...
pause >nul
echo.
echo Note: Remaining chapters will be created shortly.
echo For now, you can convert Chapter 1 to PDF using:
echo   1. Press Ctrl+P in your browser
echo   2. Select "Save as PDF"
echo   3. Enable "Background graphics"
echo   4. Click Save
goto end

:show_instructions
echo.
echo ========================================
echo   HOW TO CONVERT HTML TO PDF
echo ========================================
echo.
echo METHOD 1 - Using Web Browser (EASIEST):
echo   1. Open the HTML file in Chrome/Firefox/Edge
echo   2. Press Ctrl+P (or Cmd+P on Mac)
echo   3. Select "Save as PDF" as printer
echo   4. Enable "Background graphics" option
echo   5. Click "Save" and choose location
echo.
echo METHOD 2 - Using Microsoft Word:
echo   1. Open Word
echo   2. File -^> Open -^> Browse
echo   3. Change file type to "All Files"
echo   4. Select HTML file
echo   5. File -^> Save As -^> PDF
echo.
echo METHOD 3 - Online Tools:
echo   Visit: https://www.ilovepdf.com/html-to-pdf
echo   Upload HTML file and download PDF
echo.
echo For detailed instructions, open CONVERSION-GUIDE.html
echo.
pause
goto end

:end
echo.
echo Thank you! Your documentation is ready for submission.
echo.
pause
