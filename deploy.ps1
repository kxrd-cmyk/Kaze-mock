# Change to the dist directory
Set-Location -Path "$PSScriptRoot\dist"

# Deploy using wrangler
Write-Host "Deploying to Cloudflare Pages..." -ForegroundColor Cyan
npx wrangler deploy

# Check if deployment was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful!" -ForegroundColor Green
} else {
    Write-Host "Deployment failed. Check the error message above." -ForegroundColor Red
    exit 1
}
