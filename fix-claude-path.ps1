# fix-claude-path.ps1
# Searches for claude, adds it to PATH, or runs installer if not found.

$possiblePaths = @(
  "$env:LOCALAPPDATA\Programs\claude-code",
  "$env:USERPROFILE\AppData\Local\Programs\claude-code",
  "$env:ProgramFiles\claude-code",
  "$env:ProgramFiles(x86)\claude-code",
  "$env:APPDATA\npm"   # npm global
)

Write-Host "Searching for claude executable in common locations..."
$found = $null
foreach ($p in $possiblePaths) {
  if (Test-Path $p) {
    $exe = Get-ChildItem -Path $p -Filter "claude*.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($exe) { $found = $exe.FullName; break }
    $exe2 = Get-ChildItem -Path $p -Filter "claude" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($exe2) { $found = $exe2.FullName; break }
  }
}

if (-not $found) {
  Write-Host "No claude binary found in typical folders. Searching entire user profile (this may take a moment)..."
  $candidate = Get-ChildItem -Path $env:USERPROFILE -Filter "claude*.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($candidate) { $found = $candidate.FullName }
  else {
    $candidate2 = Get-ChildItem -Path $env:USERPROFILE -Filter "claude" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($candidate2) { $found = $candidate2.FullName }
  }
}

if ($found) {
  Write-Host "Found claude at: $found"
  $folder = Split-Path $found -Parent

  # Add to current session PATH
  if (-not ($env:PATH -split ";" | Where-Object { $_ -eq $folder })) {
    $env:PATH = "$env:PATH;$folder"
    Write-Host "Added to current session PATH: $folder"
  } else {
    Write-Host "Folder already present in current session PATH."
  }

  # Persist to User PATH
  $newPath = [Environment]::GetEnvironmentVariable("PATH","User")
  if (-not ($newPath -split ";" | Where-Object { $_ -eq $folder })) {
    $updated = if ($newPath) { "$newPath;$folder" } else { $folder }
    [Environment]::SetEnvironmentVariable("PATH", $updated, "User")
    Write-Host "Persisted folder to User PATH. Reopen terminals to pick this up."
  } else {
    Write-Host "Folder already present in persistent User PATH."
  }

  Write-Host "`nTry: claude doctor"
  Write-Host "Or run: & '$found' doctor"
}
else {
  Write-Host "Claude not installed. Two easy options follow."
  Write-Host "Option A) Native installer (recommended):"
  Write-Host "  irm https://claude.ai/install.ps1 | iex"
  Write-Host "Option B) NPM (if Node.js 18+):"
  Write-Host "  npm install -g @anthropic-ai/claude-code"
  Write-Host "`nAttempting native installer now. Press Ctrl+C to cancel..."
  try {
    irm https://claude.ai/install.ps1 | iex
    Write-Host "`nNative installer attempted. After it finishes, re-open PowerShell and run 'claude doctor'."
  } catch {
    Write-Host "Automatic installer was blocked or failed. Run the installer command manually or use npm: npm install -g @anthropic-ai/claude-code"
  }
}
