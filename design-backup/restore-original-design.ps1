# Restores the original forest-green/ivory design, overwriting the
# black & gold "Noir Edition" redesign. Run from anywhere:
#   powershell -ExecutionPolicy Bypass -File design-backup/restore-original-design.ps1
$ErrorActionPreference = 'Stop'
$backupRoot = Join-Path $PSScriptRoot 'original'
$projectRoot = Split-Path $PSScriptRoot -Parent

$restored = 0
Get-ChildItem $backupRoot -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring($backupRoot.Length + 1)
  $target = Join-Path $projectRoot $relative
  Copy-Item $_.FullName $target -Force
  $restored++
  Write-Host "restored $relative"
}
Write-Host ""
Write-Host "$restored files restored to the original design. Restart 'npm run dev' if it is running."
