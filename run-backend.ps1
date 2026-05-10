$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:JAVA_HOME = 'C:\Users\Matebook D14 BE\.jdk\jdk-21.0.8'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

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
        $dbHost = ([uri]$dbUrl).Host
        if ($dbHost) {
            try {
                Resolve-DnsName $dbHost | Out-Null
            }
            catch {
                throw @"
Supabase database host could not be resolved: $dbHost

Open Supabase Dashboard > Project Settings > Database > Connection string and verify the host.
If direct PostgreSQL keeps failing, copy the pooler connection string instead and update SUPABASE_DB_URL in .env.local.
"@
            }
        }
    }
    catch {
        throw "SUPABASE_DB_URL is not a valid PostgreSQL JDBC URL: $dbUrl"
    }
}

$mvn = 'C:\Users\Matebook D14 BE\.maven\maven-3.9.15\bin\mvn.cmd'
Push-Location (Join-Path $repoRoot 'backend')
try {
    & $mvn spring-boot:run
}
finally {
    Pop-Location
}