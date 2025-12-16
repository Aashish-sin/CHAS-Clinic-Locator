let initialized = {};

export function runOnce(key) {
  if (initialized[key]) return false;
  initialized[key] = true;
  return true;
}

