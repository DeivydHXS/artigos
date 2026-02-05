import { generateUniqueEmail, prepareUser } from "../../../support/utils/userUtils";

describe('User Registration API', () => {
  beforeEach(() => {
    cy.fixture('users').as('userData');
    cy.fixture('feedback').as('feedbackData');
  });

  describe('Success Scenarios - 201 Created', () => {
    it('TC_REG_001 - Should register a new user with valid data (integration test)', function () {
      const user = prepareUser(this.userData.validUser);

      cy.intercept('POST', '/api/users', {
        statusCode: 201,
        body: {
          message: this.feedbackData.messages.success_user_message,
          data: {
            id: 12345,
            name: user.name,
            email: user.email
          }
        }
      }).as('postUser');

      cy.visit('/register');

      cy.get('input[name="name"]').type(user.name);
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);

      cy.get('button[type="submit"]').click();

      cy.wait('@postUser').its('response.statusCode').should('eq', 201);

      cy.contains(this.feedbackData.messages.success_user_message).should('be.visible');
    });
  });

  describe('Conflict Errors - 409', () => {
    it('TC_002 - Should return 409 Conflict on duplicate email', function () {
      const email = generateUniqueEmail('duplicate');
      const firstUser = prepareUser(this.userData.validUser, { prefix: 'duplicate' });
      firstUser.email = email;

      const secondUser = { ...firstUser };

      cy.registerUser(firstUser).then((res1) => {
        expect(res1.status).to.eq(201);

        cy.registerUser(secondUser, { failOnStatusCode: false }).then((res2) => {
          expect(res2.status).to.eq(409);
          expect(res2.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
          expect(res2.body.errors.email).to.include(this.feedbackData.errors.email[2]);
        });
      });
    });
  });

  describe('Validation Errors - 422 Unprocessable Entity', () => {
    it('TC_007 - Should not register with invalid name format', function () {
      const base = this.userData.invalidUser;

      const user = prepareUser({
        name: ` @ + ${base.name} `,
        email: ` ${generateUniqueEmail('space')} `,
        password: Cypress.env('USER_INVALID_PASSWORD'),
      });

      cy.registerUser(user).then((res) => {
        expect(res.status).to.eq(422);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
        expect(res.body.errors.name[0]).to.include(this.feedbackData.errors.name[1]);
      });
    });

    it('TC_013 - Register exceeding field length limits', function () {
      const user = prepareUser({
        name: 'A'.repeat(256),
        email: generateUniqueEmail('longname'),
        password: Cypress.env('USER__VALID_PASSWORD'),
      });

      cy.registerUser(user).then((res) => {
        expect(res.status).to.eq(422);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
      });
    });

    

    it('TC_004 - Should return 422 for invalid email', function () {
      const base = this.userData.invalidUser;

      const user = prepareUser({
        name: ` ${base.name} `
      }, {
        email: base.email,
        password: Cypress.env('USER_INVALID_PASSWORD')
      });

      cy.registerUser(user).then((res) => {
        expect(res.status).to.eq(422);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
        expect(res.body.errors).to.have.property('email');
        expect(res.body.errors.email[0]).to.include(this.feedbackData.errors.email[1]);
      });
    });

    it('TC_005 - Should not register with weak password', function () {
      const user = prepareUser(this.userData.validUser, {
        prefix: 'weak',
        password: Cypress.env('USER_WEAK_PASSWORD'),
      });

      cy.registerUser(user).then((res) => {
        expect(res.status).to.eq(422);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
        expect(res.body.errors.password).to.include.members([
          this.feedbackData.errors.password[1],
          this.feedbackData.errors.password[2],
          this.feedbackData.errors.password[3],
          this.feedbackData.errors.password[4]
        ]);
      });
    });
  });

  describe('Bad Request Errors - 400 Malformed Body', () => {
    it('TC_003 - Register with empty fields', function () {
      const user = {
        ...this.userData.emptyFieldsUser,
        password: Cypress.env('USER_EMPTY_PASSWORD'),
      };

      cy.registerUser(user).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);

        expect(res.body.errors.name[0]).to.include(this.feedbackData.errors.name[0]);
        expect(res.body.errors.email[0]).to.include(this.feedbackData.errors.email[0]);
        expect(res.body.errors.password[0]).to.include(this.feedbackData.errors.password[0]);
      });
    });
    it('TC_009 - Should not register with missing email field', function () {
      const base = this.userData.missingEmailUser;

      const user = prepareUser({
        name: ` ${base.name} `
      }, {
        password: Cypress.env('USER__VALID_PASSWORD')
      });

      delete user.email;

      cy.registerUser(user).then((res) => {
        console.log('📥 Resposta completa:', JSON.stringify(res.body, null, 2));
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
        expect(res.body.errors.email).to.include(this.feedbackData.errors.email[0]);
      });
    });

    it('TC_010 - Should not register with missing password field', function () {
      const user = {
        ...this.userData.missingPasswordUser,
        email: generateUniqueEmail('missingpassword'),
      };

      cy.registerUser(user).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
        expect(res.body.errors.password[0]).to.include(this.feedbackData.errors.password[0]);
      });
    });

    it('TC_011 - Should not register with missing name field', function () {
      const user = {
        ...this.userData.missingNameUser,
        email: generateUniqueEmail('missingname'),
        password: Cypress.env('USER_MISSING_NAME_PASSWORD'),
      };

      cy.registerUser(user).then((res) => {
        expect(res.status).to.eq(400);
        expect(res.body.message).to.eq(this.feedbackData.messages.invalid_body_message);
        expect(res.body.errors.name[0]).to.include(this.feedbackData.errors.name[0]);
      });
    });
  });
});