const fs = require('fs');
const path = require('path');

// Paths to the package.json files
const localPackageJsonPath = path.join(
  __dirname,
  '../../../apps/ng-x-boilerplate-desktop/desktop/package.json',
); // Adjust path if necessary
const rootPackageJsonPath = path.join(__dirname, '../../../package.json');

try {
  // Read local package.json
  const localPackageJson = JSON.parse(
    fs.readFileSync(localPackageJsonPath, 'utf8'),
  );
  const localVersion = localPackageJson.version;

  // Read root package.json
  const rootPackageJson = JSON.parse(
    fs.readFileSync(rootPackageJsonPath, 'utf8'),
  );

  // Update root version with the local version
  rootPackageJson.version = localVersion;

  // Write updated version back to the root package.json
  fs.writeFileSync(
    rootPackageJsonPath,
    JSON.stringify(rootPackageJson, null, 2),
  );
  console.log(`Root package.json version updated to: ${localVersion}`);
  process.exit(0);
} catch (error) {
  console.error('Error syncing versions:', error.message);
  process.exit(1);
}
