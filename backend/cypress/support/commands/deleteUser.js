Cypress.Commands.add('deleteUser', (token) => {
    cy.request({
        method: 'DELETE',
        url: '/api/user',
        headers: {
            Authorization: `Bearer ${token}`
        },
        failOnStatusCode: false,
    }).then((response) => {
        return response;
    });
});