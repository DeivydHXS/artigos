export function generateUniqueEmail(prefix = 'user') {
  return `${prefix}+${Date.now()}@example.com`;
}

export function prepareUser(baseUser, options = {}) {
  const password = options.password || Cypress.env('USER__VALID_PASSWORD');

  return {
    ...baseUser,
    email: options.email || generateUniqueEmail(options.prefix || 'user'),
    password,
    password_confirmation: password
  };
}
