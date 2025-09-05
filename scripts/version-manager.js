// #!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CHANGELOG_PATH = path.join(process.cwd(), 'CHANGELOG.md');
const PACKAGE_PATH = path.join(process.cwd(), 'package.json');

// Utility functions
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8'));
  return packageJson.version;
}

function getNextVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error('Invalid version type. Use: patch, minor, or major');
  }
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Changelog functions
function readChangelog() {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    console.error('❌ CHANGELOG.md not found!');
    process.exit(1);
  }
  return fs.readFileSync(CHANGELOG_PATH, 'utf8');
}

function extractUnreleasedChanges(changelog) {
  const unreleasedSection = changelog.match(/## \[Unreleased\](.*?)(?=## \[|$)/s);
  if (!unreleasedSection) {
    return null;
  }
  
  const content = unreleasedSection[1].trim();
  const changes = {
    added: extractSection(content, 'Added'),
    changed: extractSection(content, 'Changed'), 
    fixed: extractSection(content, 'Fixed'),
    security: extractSection(content, 'Security'),
    deprecated: extractSection(content, 'Deprecated'),
    removed: extractSection(content, 'Removed')
  };
  
  // Check if there are actual changes (not just placeholders)
  const hasRealChanges = Object.values(changes).some(section => 
    section && !section.includes('Placeholder')
  );
  
  return hasRealChanges ? changes : null;
}

function extractSection(content, sectionName) {
  const regex = new RegExp(`### ${sectionName}(.*?)(?=### |$)`, 's');
  const match = content.match(regex);
  if (!match) return null;
  
  return match[1].trim().split('\n')
    .filter(line => line.trim() && line.startsWith('-'))
    .map(line => line.trim())
    .join('\n');
}

function updateChangelog(changelog, version, changes) {
  const date = getCurrentDate();
  const newVersionSection = createVersionSection(version, date, changes);
  
  // Reset Unreleased section
  const resetUnreleased = `## [Unreleased]

### Added
- Placeholder for new features

### Changed
- Placeholder for changes in existing functionality

### Fixed
- Placeholder for bug fixes

### Security
- Placeholder for security fixes

---

${newVersionSection}`;

  // Replace the Unreleased section and add new version
  const updatedChangelog = changelog.replace(
    /## \[Unreleased\].*?(?=---)/s,
    resetUnreleased
  );
  
  return updatedChangelog;
}

function createVersionSection(version, date, changes) {
  let section = `## [${version}] - ${date}\n\n`;
  
  const sections = [
    ['Added', changes.added],
    ['Changed', changes.changed], 
    ['Fixed', changes.fixed],
    ['Deprecated', changes.deprecated],
    ['Removed', changes.removed],
    ['Security', changes.security]
  ];
  
  sections.forEach(([sectionName, content]) => {
    if (content) {
      section += `### ${sectionName}\n${content}\n\n`;
    }
  });
  
  return section.trim() + '\n\n---\n';
}

// Interactive version release
async function interactiveRelease() {
  console.log('🚀 @dqcai/logger Version Release Manager\n');
  
  const currentVersion = getCurrentVersion();
  console.log(`📦 Current version: ${currentVersion}`);
  
  // Check for unreleased changes
  const changelog = readChangelog();
  const unreleasedChanges = extractUnreleasedChanges(changelog);
  
  if (!unreleasedChanges) {
    console.log('❌ No unreleased changes found in CHANGELOG.md');
    console.log('Please add your changes to the [Unreleased] section first.');
    process.exit(1);
  }
  
  console.log('\n📋 Found unreleased changes:');
  Object.entries(unreleasedChanges).forEach(([type, changes]) => {
    if (changes) {
      console.log(`\n🔸 ${type.toUpperCase()}:`);
      changes.split('\n').forEach(change => {
        console.log(`  ${change}`);
      });
    }
  });
  
  // Ask for version type
  console.log('\n🎯 What type of release is this?');
  console.log('1. patch - Bug fixes (1.0.3 → 1.0.4)');
  console.log('2. minor - New features (1.0.3 → 1.1.0)');  
  console.log('3. major - Breaking changes (1.0.3 → 2.0.0)');
  
  const versionChoice = await prompt('Enter choice (1-3): ');
  const versionTypes = { '1': 'patch', '2': 'minor', '3': 'major' };
  const versionType = versionTypes[versionChoice];
  
  if (!versionType) {
    console.log('❌ Invalid choice');
    process.exit(1);
  }
  
  const nextVersion = getNextVersion(currentVersion, versionType);
  console.log(`\n🏷️ Next version will be: ${nextVersion}`);
  
  // Ask for release notes
  const releaseNotes = await prompt('\n📝 Add release notes (optional): ');
  
  // Confirm release
  const confirm = await prompt('\n❓ Continue with release? (y/N): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ Release cancelled');
    process.exit(0);
  }
  
  try {
    // Update changelog
    console.log('\n📝 Updating CHANGELOG.md...');
    const updatedChangelog = updateChangelog(changelog, nextVersion, unreleasedChanges);
    fs.writeFileSync(CHANGELOG_PATH, updatedChangelog);
    
    // Add release notes if provided
    if (releaseNotes) {
      console.log('📝 Adding release notes...');
      // Add release notes to the version section
      const changelogWithNotes = updatedChangelog.replace(
        `## [${nextVersion}] - ${getCurrentDate()}`,
        `## [${nextVersion}] - ${getCurrentDate()}\n\n> ${releaseNotes}`
      );
      fs.writeFileSync(CHANGELOG_PATH, changelogWithNotes);
    }
    
    // Run tests
    console.log('🧪 Running tests...');
    execSync('npm test', { stdio: 'inherit' });
    
    // Build
    console.log('🏗️ Building package...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Version and commit
    console.log('🏷️ Creating version commit...');
    execSync(`npm version ${versionType} --message "chore: release v%s\n\nSee CHANGELOG.md for details"`, { stdio: 'inherit' });
    
    // Ask about publishing
    const shouldPublish = await prompt('\n📤 Publish to NPM? (y/N): ');
    if (shouldPublish.toLowerCase() === 'y') {
      console.log('📤 Publishing to NPM...');
      execSync('npm publish --access public', { stdio: 'inherit' });
      
      console.log('\n✅ Release completed successfully!');
      console.log(`🎉 @dqcai/logger v${nextVersion} is now available on NPM`);
      console.log(`📦 https://www.npmjs.com/package/@dqcai/logger/v/${nextVersion}`);
    } else {
      console.log('\n✅ Version created successfully!');
      console.log('📝 Run `npm publish --access public` when ready to publish');
    }
    
  } catch (error) {
    console.error('❌ Release failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Generate release notes from git commits
function generateReleaseNotes() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0 HEAD~1', { encoding: 'utf8' }).trim();
    const commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"- %s (%h)"`, { encoding: 'utf8' });
    
    console.log('\n📋 Generated release notes from git commits:\n');
    console.log(commits);
    
  } catch (error) {
    console.log('ℹ️ Could not generate release notes from git commits');
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'release':
    case 'interactive':
      await interactiveRelease();
      break;
      
    case 'notes':
    case 'generate-notes':
      generateReleaseNotes();
      break;
      
    case 'check':
      const changelog = readChangelog();
      const changes = extractUnreleasedChanges(changelog);
      if (changes) {
        console.log('✅ Found unreleased changes in CHANGELOG.md');
        Object.entries(changes).forEach(([type, content]) => {
          if (content) {
            console.log(`\n${type.toUpperCase()}:`);
            console.log(content);
          }
        });
      } else {
        console.log('❌ No unreleased changes found');
      }
      break;
      
    default:
      console.log('📚 @dqcai/logger Version Manager');
      console.log('\nUsage:');
      console.log('  npm run version:release     # Interactive release');
      console.log('  npm run version:check       # Check unreleased changes');  
      console.log('  npm run version:notes       # Generate release notes from git');
      console.log('\nOr directly:');
      console.log('  node scripts/version-manager.js release');
      console.log('  node scripts/version-manager.js check');
      console.log('  node scripts/version-manager.js notes');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  getCurrentVersion,
  getNextVersion,
  extractUnreleasedChanges,
  updateChangelog
};