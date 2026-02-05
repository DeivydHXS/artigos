describe('Special Cases', () => {
  beforeEach(() => {
    cy.fixture('feedback').as('feedbackData');
  });

  const password = Cypress.env('USER__VALID_PASSWORD');

  describe('Special Cases', () => {

    describe('Login special cases', () => {
      it('TCF_018 - Brute-force login attempt', function () {
        const attempts = 6;
        let rateLimited = false;

        for (let i = 0; i < attempts; i++) {
          cy.fixture("createdUser").then(({ email }) => {
            cy.login({ email, password: 'SenhaIncorreta21@' })
              .then((response) => {
                if (!rateLimited) {
                  if (response.status === 429) {
                    rateLimited = true;
                  } else {
                    expect(response.status).to.not.eq(429);
                  }
                } else {
                  expect(response.status).to.eq(429);
                }
              });
          });
        }
      });

      /* it('TCF_010 - Multiple valid login attempts', function () {
        cy.fixture("createdUser").then(({ email }) => {
          const attempts = 3;
          const tokens = [];
          const delay = ms => new Promise(res => setTimeout(res, ms));

          const loginAttempt = (count) => {
            if (count === attempts) {
              expect(new Set(tokens).size).to.eq(tokens.length);
              return;
            }

            cy.login({ email, password }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.message).to.eq(this.feedbackData.messages.login_with_success);
              tokens.push(response.body.data.token.access_token);
              delay(500).then(() => loginAttempt(count + 1));
            });
          };

          loginAttempt(0);
        });
      }); */
    });

    it('TCF_011 - Login with expired JWT token', function () {
      cy.fixture("createdUser").then(({ email }) => {
        cy.login({ email, password }).then((response) => {
          const token = response.body.data.token.access_token;

          const expiredToken = token.replace(/\.([^.]+)\./, '.eyJleHAiOjE2MDAwMDAwMDB9.');

          cy.request({
            method: 'GET',
            url: '/api/articles/feed',
            headers: {
              Authorization: `Bearer ${expiredToken}`
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.error).to.eq(this.feedbackData.errors.invalid_credentials);
          });
        });
      });
    });
  });
});