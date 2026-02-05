import { prepareUser } from "../../../support/utils/userUtils";

describe('User Delete API', () => {
    const password = Cypress.env('USER__VALID_PASSWORD');

    // Carrega fixtures antes de cada teste
    beforeEach(function () {
        return cy.fixture('feedback').as('feedbackData')
            .then(() => cy.fixture('users').as('userData'))
            .then(() => {
                const user = prepareUser(this.userData.validUser);
                this.user = user;

                return cy.registerUser(user).then((res) => {
                    expect(res.status).to.eq(201);
                    return cy.loginAndGetToken(user.email, Cypress.env('USER__VALID_PASSWORD')).then((token) => {
                        this.token = token;
                    });
                });
            });
    });

    describe('Success Scenarios', () => {
        it('TC_001 - Delete own user', function () {
            cy.deleteUser(this.token).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.message).to.eq(this.feedbackData.messages.delete_user);
            });
        });
    });

    describe('Unauthorized Cases - 401', () => {
        it('TC_004 - Attempt to delete a profile without an authentication token', function () {
            cy.deleteUser(null).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(this.feedbackData.errors.invalid_credentials);
            });
        });

        it('TC_005 - Attempt to delete a profile with an expired authentication token.', function () {
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR...fakeExpiredPart';


            cy.deleteUser(expiredToken).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(this.feedbackData.errors.invalid_credentials);
            });
        });
    });
});