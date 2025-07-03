# Update dist directory with latest files
$distPath = Join-Path -Path $PSScriptRoot -ChildPath "dist"

# Remove existing dist directory if it exists
if (Test-Path -Path $distPath) {
    Remove-Item -Path $distPath -Recurse -Force
}

# Create new dist directory
New-Item -ItemType Directory -Path $distPath | Out-Null

# Copy necessary files and directories
$itemsToCopy = @(
    "css",
    "js",
    "index.html",
    "worker.js",
    "wrangler.jsonc"
)

foreach ($item in $itemsToCopy) {
    $source = Join-Path -Path $PSScriptRoot -ChildPath $item
    $destination = Join-Path -Path $distPath -ChildPath (Split-Path -Leaf $item)
    
    if (Test-Path -Path $source) {
        if ((Get-Item $source).PSIsContainer) {
            # It's a directory, copy recursively
            Copy-Item -Path $source -Destination $destination -Recurse -Force
        } else {
            # It's a file, copy it
            Copy-Item -Path $source -Destination $destination -Force
        }
        Write-Host "Copied: $item" -ForegroundColor Green
    } else {
        Write-Host "Warning: $item not found" -ForegroundColor Yellow
    }
}

# Update wrangler.jsonc in dist to point to the worker.js in the same directory
$wranglerConfig = @{
    name = "kaze-mock"
    main = "worker.js"
    compatibility_date = "2024-03-01"
    workers_dev = $true
    pages_build_output_dir = "."
} | ConvertTo-Json -Depth 10

Set-Content -Path (Join-Path -Path $distPath -ChildPath "wrangler.jsonc") -Value $wranglerConfig

Write-Host "`nDistribution files have been updated in: $distPath" -ForegroundColor Green
