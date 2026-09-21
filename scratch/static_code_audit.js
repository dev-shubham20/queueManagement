const fs = require('fs');
const path = require('path');

const searchTerms = [
  'Math.random()',
  'TK-01',
  'TK-02',
  'activeToken: null',
  '"local"',
  "'local'",
  'MockDB',
  'local-',
  'Queue paused (local)',
  'TODO',
  'FIXME'
];

function searchDir(dir, results = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (['node_modules', '.git', '.expo', 'brain', '.system_generated'].includes(file)) continue;
    const full = path.join(dir, file);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        searchDir(full, results);
      } else if (/\.(js|ts|tsx|json|html|md)$/.test(file)) {
        // Exclude test docs and scratch audit scripts from false positives
        if (file === 'static_code_audit.js' || file === 'CAREQUEUE_TEST_CASES.md' || file === 'walkthrough.md' || file === 'implementation_plan.md') continue;
        const content = fs.readFileSync(full, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          for (const term of searchTerms) {
            if (line.includes(term)) {
              results.push({
                term,
                file: path.relative(process.cwd(), full).replace(/\\/g, '/'),
                line: idx + 1,
                content: line.trim()
              });
            }
          }
        });
      }
    } catch (e) {}
  }
  return results;
}

const res = searchDir(process.cwd());
console.log('Total matches found:', res.length);
const grouped = {};
res.forEach(r => {
  grouped[r.term] = grouped[r.term] || [];
  grouped[r.term].push(r);
});

for (const [term, matches] of Object.entries(grouped)) {
  console.log(`\n=======================================================`);
  console.log(`=== TERM: "${term}" (${matches.length} occurrences) ===`);
  console.log(`=======================================================`);
  matches.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.content.slice(0, 120)}`));
}
