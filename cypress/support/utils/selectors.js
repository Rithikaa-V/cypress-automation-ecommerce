/**
 * The customer portal uses CSS Modules, so class names look like
 * `_MenuItemsContainer_flnuv_710`. The trailing hash changes on every frontend
 * build, which silently breaks selectors that copy the whole class name.
 * Matching on the stable prefix survives redeployments.
 *
 *   cssModule('MenuItemsContainer')  ->  [class*="_MenuItemsContainer_"]
 */
export const cssModule = (name) => `[class*="_${name}_"]`;
