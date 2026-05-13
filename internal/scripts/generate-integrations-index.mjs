import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const integrationsRoot = path.join(repoRoot, 'integrations');
const indexPath = path.join(integrationsRoot, 'index.ts');

const symlinkTargets = new Set(['.nango']);

function listTsFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts'))
        .map((entry) => entry.name.slice(0, -3))
        .sort();
}

const integrationDirs = fs
    .readdirSync(integrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !symlinkTargets.has(entry.name))
    .map((entry) => entry.name)
    .sort();

const lines = [];

for (const integration of integrationDirs) {
    const integrationRoot = path.join(integrationsRoot, integration);
    const syncs = listTsFiles(path.join(integrationRoot, 'syncs'));
    const actions = listTsFiles(path.join(integrationRoot, 'actions'));
    const onEvents = listTsFiles(path.join(integrationRoot, 'on-events'));

    if (syncs.length === 0 && actions.length === 0 && onEvents.length === 0) {
        continue;
    }

    lines.push(`// -- Integration: ${integration}`);

    for (const name of syncs) {
        lines.push(`import './${integration}/syncs/${name}.js';`);
    }

    for (const name of actions) {
        lines.push(`import './${integration}/actions/${name}.js';`);
    }

    for (const name of onEvents) {
        lines.push(`import './${integration}/on-events/${name}.js';`);
    }

    lines.push('');
}

fs.writeFileSync(indexPath, `${lines.join('\n').trimEnd()}\n`, 'utf8');
console.log(`Wrote ${indexPath}`);