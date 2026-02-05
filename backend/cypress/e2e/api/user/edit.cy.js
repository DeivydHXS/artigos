import { prepareUser } from "../../../support/utils/userUtils";

describe('User Edit API', () => {
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

    describe('Success Scenarios - 200', () => {
        it('TC_001 - Edit own user profile', function () {
            const updatedUser = {
                name: 'Update name and email',
                email: this.user.email,
                birthday: '2025-08-08',
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.data.name).to.eq(updatedUser.name);
                expect(res.body.data.email).to.eq(updatedUser.email);
            });
        });

        it('TC_004 - Edit profile with only one field updated', function () {
            const updatedUser = {
                name: 'Update only name',
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.data.name).to.eq(updatedUser.name);
            });
        });

        it('TC_005 - Edit profile with valid optional fields omitted', function () {
            const updatedUser = {
                name: "Carlos",
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.data.name).to.eq(updatedUser.name);
            });
        });

        it('TC_019 - Edit with leading/trailing spaces', function () {
            const updatedUser = {
                name: ` ${'Carlos'} `,
                email: ` ${this.user.email} `,
                birthday: ` ${'2025-08-08'} `
            };

            console.log(updatedUser);

            cy.editUser(updatedUser, this.token).then((res) => {
                console.log(res.body);
                expect(res.status).to.eq(200);
                expect(res.body.data.name).to.eq(updatedUser.name.trim());
                expect(res.body.data.email).to.eq(updatedUser.email.trim());
                expect(res.body.data.birthday).to.eq(updatedUser.birthday.trim());
            });
        });
    });

    describe('Unauthorized Cases - 401', () => {
        it('TC_014 - Edit without authentication token', function () {
            const updatedUser = {
                name: "Carlos",
            };

            cy.editUser(updatedUser, null).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(this.feedbackData.errors.invalid_credentials);
            });
        });

        it('TC_015 - Edit with expired token', function () {
            const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR...fakeExpiredPart';

            const updatedUser = {
                name: 'Hacker',
                email: `only${Date.now()}@test.com`,
            };

            cy.editUser(updatedUser, expiredToken).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body.error).to.eq(this.feedbackData.errors.invalid_credentials);
            });
        });
    });

    describe('Validation Errors - 422 Unprocessable Entity', () => {
        it('TC_006 - Edit with special characters in name', function () {
            const updatedUser = {
                name: 'João D’Ángelo @ Dev',
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(422);
                expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
                expect(res.body.errors.name[0]).to.include(this.feedbackData.errors.name[1]);
            });
        });

        it('TC_007 - Edit with maximum allowed length for each field', function () {
            const updatedUser = {
                name: 'A'.repeat(256),
                email: 'teste'.repeat(242) + '@gmail.com'
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(422);
                expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
            });
        });

        it('TC_009 - Edit with invalid email format', function () {
            const updatedUser = {
                email: 'email_invalido'
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(422);
                expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
                expect(res.body.errors.email[0]).to.eq(this.feedbackData.errors.email[1]);
            });
        });

        it('TC_010 - Edit with invalid data types (e.g., number in name)', function () {
            const updatedUser = {
                name: 'Carlos21'
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(422);
                expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
                expect(res.body.errors.name[0]).to.eq(this.feedbackData.errors.name[1]);
            });
        });

        it('TC_011 - Edit with empty string for required fields', function () {
            const updatedUser = {
                name: '',
                email: '',
                birthday: '',
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(422);
                expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
                expect(res.body.errors.name[0]).to.eq(this.feedbackData.errors.name[1]);
                expect(res.body.errors.email[0]).to.eq(this.feedbackData.errors.email[1]);
                expect(res.body.errors.birthday[0]).to.eq(this.feedbackData.errors.birthday[0]);
            });
        });

        it('TC_020 - Edit with emoji in name or bio fields', function () {
            const updatedUser = {
                name: '✨🎉 Caros',
            };

            cy.editUser(updatedUser, this.token).then((res) => {
                expect(res.status).to.eq(422);
                expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
                expect(res.body.errors.name[0]).to.include(this.feedbackData.errors.name[1]);
            });
        });
    });

    describe('Conflict - 409', () => {
        it('TC_002 - Try editing another user', function () {
            const user1 = {
                name: 'User One',
                email: `user1_${Date.now()}@test.com`,
                password,
                password_confirmation: password,
            };
            const user2 = {
                name: 'User Two',
                email: `user2_${Date.now()}@test.com`,
                password,
                password_confirmation: password,
            };

            let tokenUser2;

            cy.request('POST', '/api/register', user1).then(() => {
                cy.request('POST', '/api/register', user2).then(() => {
                    cy.request('POST', '/api/login', {
                        email: user2.email,
                        password: password,
                    }).then((res) => {
                        tokenUser2 = res.body.data.token.access_token;

                        const updatedData = {
                            name: 'Tentativa de invasão',
                            email: user1.email, // Email já existente 
                        };

                        cy.request({
                            method: 'POST',
                            url: '/api/user',
                            headers: {
                                Authorization: `Bearer ${tokenUser2}`,
                            },
                            body: updatedData,
                            failOnStatusCode: false,
                        }).then((res) => {
                            expect(res.status).to.eq(409);
                            expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
                            expect(res.body.errors.email).to.eq(this.feedbackData.errors.email[2]);
                        });
                    });
                });
            });
        });

        /* it('TC_016 - Try editing another user (unauthorized) and ensure no data is changed', function () {
            const user1 = prepareUser(this.userData.validUser);
            const user2 = prepareUser(this.userData.validUser);

            let tokenUser1, tokenUser2;
            let originalUser1;

            // Registra e loga user1
            cy.registerUser(user1).then(() => {
                return cy.login({ email: user1.email, password }).then((res) => {
                    tokenUser1 = res.body.data.token.access_token;

                    return cy.request({
                        method: 'GET',
                        url: '/api/user',
                        headers: { Authorization: `Bearer ${tokenUser1}` }
                    }).then((res) => {
                        originalUser1 = res.body;

                        // Registra e loga user2
                        return cy.registerUser(user2).then(() => {
                            return cy.login({ email: user2.email, password }).then((res) => {
                                tokenUser2 = res.body.data.token.access_token;

                                // Tenta editar user1 com token do user2
                                const updatedUser = {
                                    name: 'Tentativa de invasão',
                                    email: user1.email
                                };

                                return cy.editUser(updatedUser, tokenUser2).then((res) => {
                                    expect(res.status).to.eq(409);
                                    expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
                                    expect(res.body.errors.email).to.eq(this.feedbackData.errors.email[2]);
                                });
                            });
                        });
                    });
                });
            }).then(() => {
                // Garante que os dados do user1 não foram alterados
                return cy.login({ email: user1.email, password }).then((res) => {
                    const tokenUser1 = res.body.data.token.access_token;

                    return cy.request({
                        method: 'GET',
                        url: '/api/user',
                        headers: { Authorization: `Bearer ${tokenUser1}` }
                    }).then((res) => {
                        const user1After = res.body;

                        expect(user1After.name).to.eq(originalUser1.name);
                        expect(user1After.email).to.eq(originalUser1.email);
                    });
                });
            });
        }); */
    });
});