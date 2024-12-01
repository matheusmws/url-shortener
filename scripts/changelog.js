const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CHANGELOG_PATH = 'CHANGELOG.md';

function getLatestVersion() {
  const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const versionMatch = changelog.match(/## \[(\d+\.\d+\.\d+)\]/);
  return versionMatch ? versionMatch[1] : '0.0.0';
}

function incrementVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return version;
  }
}

function updateChangelog(version, changes) {
  const today = new Date().toISOString().split('T')[0];
  const changelogEntry = `## [${version}] - ${today}
${changes}

`;

  const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const updatedChangelog = changelog.replace(
    /(# Changelog.*?\n\n)/s,
    `$1${changelogEntry}`
  );

  fs.writeFileSync(CHANGELOG_PATH, updatedChangelog);
}

function promptUser() {
  const currentVersion = getLatestVersion();
  
  rl.question('Tipo de alteração (major/minor/patch): ', (type) => {
    const newVersion = incrementVersion(currentVersion, type.toLowerCase());
    
    rl.question('Digite as alterações (formato Markdown):\n', (changes) => {
      updateChangelog(newVersion, changes);
      
      console.log(`\nChangelog atualizado para versão ${newVersion}`);
      
      rl.question('Criar commit e tag? (s/n): ', (answer) => {
        if (answer.toLowerCase() === 's') {
          try {
            execSync('git add CHANGELOG.md');
            execSync(`git commit -m "docs: atualiza changelog para versão ${newVersion}"`);
            execSync(`git tag -a v${newVersion} -m "Versão ${newVersion}"`);
            console.log('Commit e tag criados com sucesso!');
          } catch (error) {
            console.error('Erro ao criar commit/tag:', error.message);
          }
        }
        rl.close();
      });
    });
  });
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.scripts.changelog) {
  packageJson.scripts.changelog = 'node scripts/changelog.js';
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}

if (require.main === module) {
  promptUser();
} 