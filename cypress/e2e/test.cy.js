describe('User Login', () => {
  it('should log in a user', () => {
    // Visit the login page
    cy.visit('http://localhost:3000/users/login');

    // Perform login actions - assuming form elements have correct IDs or classes
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('testpassword');
    cy.get('form').submit();

    // Validate successful login redirection
    cy.url().should('include', '/users/profile');

    // Validate success message
    cy.contains('You have successfully logged in').should('exist');
  });

  it('should handle wrong email address', () => {
    cy.visit('http://localhost:3000/users/login');

    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('testpassword');
    cy.get('form').submit();

    // Validate error message
    cy.contains('wrong email address').should('exist');
    cy.url().should('include', '/users/login');
  });

  it('should handle wrong password', () => {
    cy.visit('http://localhost:3000/users/login');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('form').submit();

    // Validate error message
    cy.contains('wrong password').should('exist');
    cy.url().should('include', '/users/login');
  });
});