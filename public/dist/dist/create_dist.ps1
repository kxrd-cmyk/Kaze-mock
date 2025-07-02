# Create dist directory if it doesn't exist
$distPath = Join-Path -Path $PSScriptRoot -ChildPath "dist"
if (-not (Test-Path -Path $distPath)) {
    New-Item -ItemType Directory -Path $distPath | Out-Null
}

# Copy all files and directories except dist and node_modules
Get-ChildItem -Path $PSScriptRoot -Exclude "dist","node_modules",".git" | ForEach-Object {
    $destination = Join-Path -Path $distPath -ChildPath $_.Name
    
    if ($_.PSIsContainer) {
        # It's a directory, copy recursively
        Copy-Item -Path $_.FullName -Destination $destination -Recurse -Force
    } else {
        # It's a file, copy it
        Copy-Item -Path $_.FullName -Destination $destination -Force
    }
}

Write-Host "Distribution files have been created in: $distPath" -ForegroundColor Green
