const fs = require('fs');
const path = require('path');

function searchAll(pattern) {
  const matches = [];
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      if (['node_modules', '.git', '.expo', 'brain', '.system_generated'].includes(f)) continue;
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/\.(js|ts|tsx|html|json)$/.test(f)) {
        if (p.includes('scratch') || p.includes('CAREQUEUE_TEST_CASES.md')) continue;
        const c = fs.readFileSync(p, 'utf8');
        const lines = c.split('\n');
        lines.forEach((l, idx) => {
          if (pattern instanceof RegExp ? pattern.test(l) : l.includes(pattern)) {
            matches.push({ file: p.replace(/\\/g, '/'), line: idx + 1, content: l.trim() });
          }
        });
      }
    }
  }
  walk(process.cwd());
  return matches;
}

console.log('--- 1. Math.random() ---');
const mathRandom = searchAll('Math.random()');
console.log(`Found ${mathRandom.length} occurrences:`);
mathRandom.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.content}`));

console.log('\n--- 2. Hardcoded token numbers (TK-01, TK-02, GP-402, etc.) ---');
const hardcodedTokens = searchAll(/TK-0[1-9]|GP-402|E-001/);
console.log(`Found ${hardcodedTokens.length} occurrences:`);
hardcodedTokens.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.content}`));

console.log('\n--- 3. activeToken: null ---');
const activeTokenNull = searchAll('activeToken: null');
console.log(`Found ${activeTokenNull.length} occurrences:`);
activeTokenNull.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.content}`));

console.log('\n--- 4. local-* and backdoor occurrences ---');
const localDash = searchAll(/local-[a-zA-Z0-9*_-]+/);
console.log(`Found ${localDash.length} occurrences:`);
localDash.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.content}`));

console.log('\n--- 5. Queue paused (local) or (local) responses ---');
const localResponses = searchAll('(local)');
console.log(`Found ${localResponses.length} occurrences:`);
localResponses.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.content}`));

console.log('\n--- 6. TODO and FIXME ---');
const todos = searchAll(/TODO|FIXME/);
console.log(`Found ${todos.length} occurrences:`);
todos.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.content}`));
