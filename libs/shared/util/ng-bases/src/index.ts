/**
 * @file The orchestration (order) of the exports in this index file is
 * important, because of the dependencies between the exported items themselves.
 * For example, some of the base-feature components (indirectly) depend on the
 * base-map (because of the 'data-access' lib which is initialized in them, and
 * the 'data-access' lib's effect file which calls the 'map' lib's methods), so
 * the base-map must be exported first.
 */

export * from './lib/base-app-init-v1/base-app-init.service';

export * from './lib/base-fun-v1/base-fun.component';

export * from './lib/base-map-v1/base';

export * from './lib/base-data-access-v1/base.facade';

export * from './lib/base-ui-v1/base-ui.component';

export * from './lib/base-feature-v1/base-feature-ext-x-credit.component';
export * from './lib/base-feature-v1/base-feature-ext.component';
export * from './lib/base-feature-v1/base-feature.component';

export * from './lib/base-page-v2/base-page-child-ext-x-users.component';
export * from './lib/base-page-v2/base-page-child.component';
export * from './lib/base-page-v2/base-page-parent-ext-x-users.component';
export * from './lib/base-page-v2/base-page-parent.component';
export * from './lib/base-page-v2/base-page.component';
