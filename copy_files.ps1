# Create public directory if it doesn't exist
if (-not (Test-Path -Path "public")) {
    New-Item -ItemType Directory -Path "public"
}

# Copy all files and directories except exclusions
Get-ChildItem -Path . -Exclude @('node_modules', '.git', 'public', '*.ps1', 'wrangler.jsonc', 'package*.json') | ForEach-Object {
    $destination = Join-Path -Path "public" -ChildPath $_.Name
    if ($_.PSIsContainer) {
        # It's a directory, copy recursively
        Copy-Item -Path $_.FullName -Destination $destination -Recurse -Force
    } else {
        # It's a file, copy it
        Copy-Item -Path $_.FullName -Destination $destination -Force
    }
}

Write-Host "Files copied to public directory successfully!"
