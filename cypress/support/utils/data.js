/** Helpers that make test data unique per run, so repeated runs do not collide. */

export function uniqueSuffix() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

export function uniqueName(prefix) {
  return `${prefix} ${uniqueSuffix()}`;
}

export function uniqueEmail(localPart = 'qa.automation', domain = 'example.com') {
  return `${localPart}+${uniqueSuffix()}@${domain}`;
}
