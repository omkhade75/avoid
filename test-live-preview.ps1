# Test Live Preview - Quick Setup Script

Write-Host "🚀 Agent Factory Pro - Live Preview Test Setup" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Create test ZIP
Write-Host "📦 Creating test project ZIP..." -ForegroundColor Yellow
$testProjectPath = Join-Path $PSScriptRoot "test-project"
$zipPath = Join-Path $PSScriptRoot "test-project.zip"

# Remove old ZIP if exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "   ✓ Removed old ZIP file" -ForegroundColor Green
}

# Create new ZIP
Compress-Archive -Path $testProjectPath -DestinationPath $zipPath -Force
Write-Host "   ✓ Created: test-project.zip" -ForegroundColor Green
Write-Host ""

# Check if dev server is running
Write-Host "🔍 Checking development server..." -ForegroundColor Yellow
$serverRunning = $false
try {
    Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue | Out-Null
    $serverRunning = $true
    Write-Host "   ✓ Server is running on http://localhost:5173" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Server is NOT running" -ForegroundColor Red
    Write-Host "   → Run 'npm run dev' first!" -ForegroundColor Yellow
}
Write-Host ""

# Instructions
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""
Write-Host "1. Open your browser to: " -NoNewline
Write-Host "http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "2. Navigate to any agent's detail page" -ForegroundColor White
Write-Host ""
Write-Host "3. Click the " -NoNewline
Write-Host "'Integrate Project'" -ForegroundColor Yellow -NoNewline
Write-Host " button" -ForegroundColor White
Write-Host ""
Write-Host "4. Upload: " -NoNewline
Write-Host "test-project.zip" -ForegroundColor Green
Write-Host ""
Write-Host "5. Watch the live preview appear!" -ForegroundColor White
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Offer to open browser
if ($serverRunning) {
    $openBrowser = Read-Host "Open browser now? (Y/n)"
    if ($openBrowser -ne 'n' -and $openBrowser -ne 'N') {
        Write-Host "🌐 Opening browser..." -ForegroundColor Cyan
        Start-Process "http://localhost:5173"
        Start-Sleep -Seconds 1
        
        # Open file explorer to show the ZIP
        Write-Host "📂 Opening file explorer..." -ForegroundColor Cyan
        explorer.exe /select, $zipPath
    }
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
