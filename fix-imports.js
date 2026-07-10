const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
};

const appDir = path.join(__dirname, 'src', 'app');
const dirsToFix = ['(patient)', '(doctor)', '(auth)'];

dirsToFix.forEach(group => {
  const groupPath = path.join(appDir, group);
  if (fs.existsSync(groupPath)) {
    const files = walk(groupPath);
    files.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      if (content.includes('../components/')) {
        content = content.replace(/\.\.\/components\//g, '../../components/');
        fs.writeFileSync(file, content);
        console.log(`Fixed imports in ${file}`);
      }
    });
  }
});
