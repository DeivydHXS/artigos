Cypress.Commands.add('registerUser', (userData) => {
  cy.request({
    method: 'POST',
    url: '/api/register',
    body: userData,
    failOnStatusCode: false,
  }).then((response) => {
    return response;
  });
});