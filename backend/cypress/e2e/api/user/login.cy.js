describe('User Login API', () => {
  beforeEach(() => {
    cy.fixture('feedback').as('feedbackData');
  });

  const password = Cypress.env('USER__VALID_PASSWORD');
  describe('Success Scenarios - 200', () => {
    it('TCF_001 - Login with valid credentials.', function () {
      cy.fixture('createdUser.json').then(({ email }) => {
        cy.login({ email, password }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq(this.feedbackData.messages.login_with_success);

          expect(response.body.data).to.have.property('user');
          expect(response.body.data.user.email).to.eq(email);
          expect(response.body.data.user).to.have.property('id');
          expect(response.body.data.token).to.have.property('access_token');
        });
      });
    });
  });

  describe('Unprocessable Entity Scenarios - 422', () => {
    it('TCF_008 - Login with email containing internal space', function () {
      cy.fixture("createdUser").then(({ email }) => {
        console.log(email);
        const emailWithEspace = email.replace('@', ' @');
        cy.login({ email: emailWithEspace, password }).then((response) => {
          console.log(response);
          expect(response.status).to.eq(422);
          expect(response.body.message).to.eq(this.feedbackData.messages.invalid_body_message);

          expect(response.body.errors).to.have.property('email');
          expect(response.body.errors.email[0]).to.include(this.feedbackData.errors.email[1]);
        });
      });
    });

    it('TCF_011 - Login with invalid email format', function () {
      cy.login({ email: "email_invalido", password }).then((response) => {
        expect(response.status).to.eq(422);
        expect(response.body.message).to.eq(this.feedbackData.messages.invalid_body_message);

        expect(response.body.errors).to.have.property('email');
        expect(response.body.errors.email[0]).to.include(this.feedbackData.errors.email[1]);
      });
    });
  });

  describe('Bad Request Errors - 400', () => {
    it('TCF_005 - Login with empty email', function () {
      cy.login({
        email: "",
        password: password
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq(this.feedbackData.messages.invalid_body_message);

        expect(response.body.errors).to.have.property('email');
        expect(response.body.errors.email[0]).to.include(this.feedbackData.errors.email[0]);
      });
    });

    it('TCF_006 - Login with empty password', function () {
      cy.fixture('createdUser.json').then(({ email }) => {
        cy.login({ email, password: "" }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq(this.feedbackData.messages.invalid_body_message);

          expect(response.body.errors).to.have.property('password');
          expect(response.body.errors.password[0]).to.include(this.feedbackData.errors.password[0]);
        });
      });
    });

    it('TCF_007 - Login with both fields empty', function () {
      cy.fixture('createdUser.json').then(({ email }) => {
        cy.login({ email: "", password: "" }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq(this.feedbackData.messages.invalid_body_message);

          expect(response.body.errors).to.have.property('email');
          expect(response.body.errors.email[0]).to.include(this.feedbackData.errors.email[0]);
          expect(response.body.errors).to.have.property('password');
          expect(response.body.errors.password[0]).to.include(this.feedbackData.errors.password[0]);
        });
      });
    });
  });

  describe('Authentication Errors - 401', () => {
    it('TCF_003 - Login with unregistered email', function () {
      cy.login({ email: "itest@gmail.com", password }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.eq(this.feedbackData.messages.invalid_body_message);

        expect(response.body.errors).to.include(this.feedbackData.errors.login);
      });
    });

    it('TCF_004 - Login with incorrect password', function () {
      cy.fixture('createdUser.json').then(({ email }) => {
        cy.login({ email, password: "SenhaIncorreta21@" }).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
          expect(response.body.errors).to.eq(this.feedbackData.errors.login);
        });
      });
    });
  });

  describe('Security Cases', () => {
    it('TC_014 - Ensure password is not returned in response', function () {
      cy.fixture('createdUser.json').then(({ email }) => {
        cy.login({ email, password }).then((response) => {
          expect(response.status).to.eq(200);

          expect(response.body.data).to.have.property('user');
          expect(response.body.data.user).to.not.have.property('password');
        });
      });
    });

    it('TC_018 - Login using GET method', function () {
      cy.fixture("createdUser").then(({ email }) => {
        cy.request({
          method: 'GET',
          url: '/api/login',
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(405);
        });
      });
    });

    it('TC_019 - Verify JWT expiration', function () {
      cy.fixture("createdUser").then(({ email }) => {
        cy.login({ email, password })
          .then((response) => {
            expect(response.status).to.eq(200);

            const token = response.body.data.token.access_token;
            expect(token).to.exist;

            console.log(token);

            //Separando o token JWT (Header, Payload, Signature)
            const payloadBase64 = token.split('.')[1];

            console.log(payloadBase64);

            //Decodificando a parte do payload do JWT
            const payloadJson = JSON.parse(atob(payloadBase64)); //atob decodifica a string base64 e retorna o JSON em texto.

            console.log(payloadJson);

            //Verificando se o campo 'exp' existe no payload
            expect(payloadJson).to.have.property('exp');
            expect(typeof payloadJson.exp).to.eq('number');
          });
      });
    });
  });
});