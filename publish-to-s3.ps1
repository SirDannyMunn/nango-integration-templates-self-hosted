param(
    [string]$BucketName = 'nango-self-hosted-770957583915-us-east-1',
    [string]$AwsRegion = 'us-east-1'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

npm run resolve:aliases
npm run compile:integrations

$env:AWS_DEFAULT_REGION = $AwsRegion

$integrationDirs = Get-ChildItem -Path (Join-Path $repoRoot 'integrations') -Directory |
    Where-Object { $_.Name -ne '.nango' -and (Test-Path (Join-Path $_.FullName 'build')) }

foreach ($dir in $integrationDirs) {
    $target = "s3://$BucketName/templates-zero/$($dir.Name)"
    aws s3 sync $dir.FullName $target
}