/* eslint-disable */
export default {
  displayName: 'ng-x-boilerplate-mobile',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/ng-x-boilerplate-mobile',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|@stencil/core|.*.mjs$))',
    '<rootDir>/node_modules/.pnpm/(?!(@ionic/angular|@ionic/core|ionicons|@stencil/core|@angular/*)@)',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
