$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$jdkPath = 'C:\Users\Matebook D14 BE\.jdk\jdk-21.0.8'
if (Test-Path $jdkPath) {
    $env:JAVA_HOME = $jdkPath
    $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

$envFile = Join-Path $repoRoot '.env.local'
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -and -not $_.StartsWith('#')) {
            $name, $value = $_.Split('=', 2)
            [Environment]::SetEnvironmentVariable($name, $value)
        }
    }
}

$dbUrl = $env:SUPABASE_DB_URL
if ($dbUrl) {
    try {
        $dbUri = [uri]($dbUrl -replace '^jdbc:', '')
        if ($dbUri.Host -like '*.pooler.supabase.com') {
            $poolerPort = if ($dbUri.Port -gt 0) { $dbUri.Port } else { 6543 }
            $poolerPath = $dbUri.AbsolutePath.TrimStart('/')
            if (-not $poolerPath) {
                $poolerPath = 'postgres'
            }

            $poolerQuery = $dbUri.Query.TrimStart('?')
            if (-not $poolerQuery) {
                $poolerQuery = 'sslmode=require&preferQueryMode=simple&prepareThreshold=0&connectTimeout=30'
            }
            elseif ($poolerQuery -notmatch '(^|&)connectTimeout=') {
                $poolerQuery += '&connectTimeout=30'
            }

            $resolvedIp = $null
            $resolvedAddresses = @('57.182.231.186') + (Resolve-DnsName -Name $dbUri.Host -Type A -ErrorAction Stop |
                Where-Object { $_.IPAddress } |
                Select-Object -ExpandProperty IPAddress) | Select-Object -Unique

            foreach ($resolvedAddress in $resolvedAddresses) {
                if (Test-NetConnection -ComputerName $resolvedAddress -Port $poolerPort -InformationLevel Quiet -WarningAction SilentlyContinue) {
                    $resolvedIp = $resolvedAddress
                    break
                }
            }

            if (-not $resolvedIp) {
                throw "Could not reach any resolved IP for Supabase pooler host $($dbUri.Host) on port $poolerPort."
            }

            $rewrittenUrl = "jdbc:postgresql://$resolvedIp`:$poolerPort/$poolerPath"
            if ($poolerQuery) {
                $rewrittenUrl += "?$poolerQuery"
            }

            [Environment]::SetEnvironmentVariable('SUPABASE_DB_URL', $rewrittenUrl)
            $dbUrl = $rewrittenUrl
            Write-Host "Using Supabase pooler IP $resolvedIp for local startup." -ForegroundColor Yellow
        }
    }
    catch {
        throw "Unable to prepare a reachable Supabase database URL: $($_.Exception.Message)"
    }
}

$mvnPath = 'C:\Users\Matebook D14 BE\.maven\maven-3.9.15\bin\mvn.cmd'
if (Test-Path $mvnPath) {
    $mvn = $mvnPath
} else {
    $mvn = 'mvn.cmd'
}

Push-Location (Join-Path $repoRoot 'backend')
try {
    & $mvn spring-boot:run
}
finally {
    Pop-Location
}