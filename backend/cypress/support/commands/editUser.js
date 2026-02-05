Cypress.Commands.add('editUser', (userData, token) => {
    cy.request({
        method: 'POST',
        url: '/api/user',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: userData,
        failOnStatusCode: false,
    }).then((response) => {
        return response;
    });
})

Cypress.Commands.add('loginAndGetToken', (email, password) => {
    return cy.login({ email, password }).then((response) => {
        return response.body.data.token.access_token;
    });
});