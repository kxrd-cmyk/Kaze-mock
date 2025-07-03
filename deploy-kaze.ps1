# Change to project directory
$projectDir = "$PSScriptRoot"
$distDir = "$projectDir\dist"

# Ensure dist directory exists
if (-not (Test-Path $distDir)) {
    Write-Error "Error: dist directory not found at $distDir"
    exit 1
}

# Deploy using wrangler
Write-Host "🚀 Deploying to Cloudflare Pages..." -ForegroundColor Cyan
npx wrangler pages deploy $distDir --project-name=kazedrop --commit-dirty=true

# Check if deployment was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "Your site should be available at: https://kazedrop.pages.dev" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
}

# Pause to see the output
Write-Host "`nPress any key to exit..." -NoNewline
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
