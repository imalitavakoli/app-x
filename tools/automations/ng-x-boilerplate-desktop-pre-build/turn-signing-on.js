const fs = require('fs');
const path = require('path');
const os = require('os');

// Path to the maker.options.json file
const makerOptionsPath = path.join(
  __dirname,
  '../../../apps/ng-x-boilerplate-desktop/desktop/src/app/options/maker.options.json',
);

// Platform-specific functions
const platformHandlers = {
  darwin: async () => {
    try {
      // Read the existing JSON file
      const makerOptions = JSON.parse(
        fs.readFileSync(makerOptionsPath, 'utf8'),
      );

      // Update the mac.identity property
      if (makerOptions.mac && typeof makerOptions.mac === 'object') {
        makerOptions.mac.identity = 'MohammadHadi Tavakoli Ghinani';
      }

      // Write the updated JSON back to the file
      fs.writeFileSync(
        makerOptionsPath,
        JSON.stringify(makerOptions, null, 2),
        'utf8',
      );

      console.log('Updated mac.identity in maker.options.json');
      return true;
    } catch (error) {
      console.error(
        'Error updating mac.identity in maker.options.json:',
        error.message,
      );
      throw error;
    }
  },

  win32: async () => {
    // Placeholder for Windows-specific logic
    console.log('Windows-specific signing logic not implemented yet');
    return true;
  },

  linux: async () => {
    // Placeholder for Linux-specific logic
    console.log('Linux-specific signing logic not implemented yet');
    return true;
  },
};

async function main() {
  try {
    const platform = os.platform();
    const handler = platformHandlers[platform];

    if (!handler) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    await handler();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
