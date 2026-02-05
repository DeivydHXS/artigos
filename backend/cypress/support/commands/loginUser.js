Cypress.Commands.add('login', (userData) => {
  cy.request({
    method: 'POST',
    url: '/api/login',
    body: userData,
    failOnStatusCode: false,
  }).then((response) => {
    return response;
  });
});