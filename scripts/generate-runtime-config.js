const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const envPath = path.join(workspaceRoot, '.env.local');
const outputPath = path.join(workspaceRoot, 'public', 'runtime-config.js');

function parseEnvFile(content) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((accumulator, line) => {
      const equalsIndex = line.indexOf('=');

      if (equalsIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, equalsIndex).trim();
      const value = line.slice(equalsIndex + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
}

function buildRuntimeConfig(environment) {
  return {
    REACT_APP_SUPABASE_URL: environment.REACT_APP_SUPABASE_URL || '',
    REACT_APP_SUPABASE_ANON_KEY: environment.REACT_APP_SUPABASE_ANON_KEY || '',
    REACT_APP_API_BASE_URL: environment.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'
  };
}

function writeRuntimeConfig(config) {
  const fileContent = `window.__ROOMLY_RUNTIME_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, fileContent, 'utf8');
}

function main() {
  let mergedEnvironment = process.env;

  if (fs.existsSync(envPath)) {
    const fileEnvironment = parseEnvFile(fs.readFileSync(envPath, 'utf8'));
    mergedEnvironment = { ...fileEnvironment, ...process.env };
  }

  const config = buildRuntimeConfig(mergedEnvironment);
  writeRuntimeConfig(config);

  if (!config.REACT_APP_SUPABASE_URL || !config.REACT_APP_SUPABASE_ANON_KEY) {
    console.warn('Roomly runtime config generated without Supabase keys. Check .env.local.');
  }
}

main();