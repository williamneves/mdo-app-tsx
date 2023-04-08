describe( 'Login Form', () => {
  beforeEach( () => {
    // Replace 'your_base_url' with your actual application's base URL
    const baseUrl = 'http://localhost:3000'; // or 'your_base_url'

    // Visit the login page
    cy.visit( `${baseUrl}/login` );
  } );


  // Check if the page has the required elements
  it( 'should have the required elements', () => {
    cy.get( '#email' ).should( 'be.visible' );
    cy.get( '#password' ).should( 'be.visible' );
    cy.get( '#login-button' ).should( 'be.visible' );
    // cy.get( '#google-login-button' ).should( 'be.visible' );
  } );

  // Validate the email input
  it( 'should validate the email input', () => {
    const testInputs = [
      { value: '', errorText: 'Email é obrigatório' },
      { value: 'test', errorText: 'Insira um email válido' },
      { value: 'test@test', errorText: 'Insira um email válido' },
      { value: 'test.com', errorText: 'Insira um email válido' },
      { value: 'test@tes..com', errorText: 'Insira um email válido' },
      { value: 'test@test.com', errorText: null },
    ];

    testInputs.forEach( ( input ) => {
      if ( !input.value ) {
        cy.get( '#email' )
          .clear()
          .focus()
          .blur();
      }

      else {
        cy.get( '#email' )
          .focus()
          .clear()
          .type( input.value )
          .blur();
      }

      if ( input.errorText ) {
        cy.get( '#email-helper-text' ).should( 'be.visible' ).and( 'contain.text', input.errorText );

        // Button should be disabled
        cy.get( '#login-button' ).should( 'be.disabled' );
      } else {
        cy.get( '#email-helper-text' ).should( 'not.exist' );
      }

      // Wait for the next input to be tested
      cy.wait( 100 );
    } );
  } );

  // Validate the password input
  it( 'should validate the password input', () => {

    const testInputs = [
      { value: '', errorText: 'Mín 6 dígitos' },
      { value: '12', errorText: 'Mín 6 dígitos' },
      { value: '12345', errorText: 'Mín 6 dígitos' },
      { value: '123456890', errorText: null },
      { value: '123456', errorText: null },
    ]


    testInputs.forEach( ( input ) => {

      if ( !input.value ) {
        cy.get( '#password' )
          .clear()
          .focus()
          .blur();
      }

      else {
        cy.get( '#password' )
          .focus()
          .clear()
          .type( input.value )
          .blur();
      }

      if ( input.errorText ) {
        cy.get( '#password-helper-text' ).should( 'be.visible' ).and( 'contain.text', input.errorText );

        // Button should be disabled
        cy.get( '#login-button' ).should( 'be.disabled' );
      } else {
        cy.get( '#password-helper-text' ).should( 'not.exist' );
      }

      // Wait for the next input to be tested
      cy.wait( 100 );

    } );

  } )

  // Check the button behavior
  it( 'should check the button behavior', () => {

    // At the first load, the button should be enabled
    cy.get( '#login-button' ).should( 'be.enabled' );

    // With invalid inputs, the button should be disabled
    // Invalid inputs can be or missing one of the fields, or one of the fields with invalid data
    cy.get( '#email' ).focus().clear().blur();
    cy.get( '#password' ).focus().clear().blur();
    cy.get( '#login-button' ).should( 'be.disabled' );

    // With invalid inputs, the button should be disabled
    cy.get( '#email' ).focus().clear().type( 'test' ).blur();
    cy.get( '#password' ).focus().clear().type( '12345' ).blur();
    cy.get( '#login-button' ).should( 'be.disabled' );

    // With email valid and password invalid, the button should be disabled
    cy.get( '#email' ).focus().clear().type( 'test@test.com' ).blur();
    cy.get( '#password' ).focus().clear().type( '12345' ).blur();
    cy.get( '#login-button' ).should( 'be.disabled' );

    // With email valid and empty password, the button should be disabled
    cy.get( '#email' ).focus().clear().type( 'test@test.com' ).blur();
    cy.get( '#password' ).focus().clear().blur();
    cy.get( '#login-button' ).should( 'be.disabled' );

    // With email invalid and password valid, the button should be disabled
    cy.get( '#email' ).focus().clear().type( 'test' ).blur();
    cy.get( '#password' ).focus().clear().type( '123456' ).blur();
    cy.get( '#login-button' ).should( 'be.disabled' );

    // With email empty and password valid, the button should be disabled
    cy.get( '#email' ).focus().clear().blur();
    cy.get( '#password' ).focus().clear().type( '123456' ).blur();
    cy.get( '#login-button' ).should( 'be.disabled' );

    // With valid inputs, the button should be enabled
    cy.get( '#email' ).focus().clear().type( 'test@test.com' ).blur();
    cy.get( '#password' ).focus().clear().type( '123456' ).blur();
    cy.get( '#login-button' ).should( 'be.enabled' );


    // With valid inputs, (but not the correct ones), the button should be enabled, and if clicked, should show an error message saying that the credentials are invalid

    cy.get( '#email' ).focus().clear().type( 'test@test.com' ).blur();
    cy.get( '#password' ).focus().clear().type( '123456' ).blur();

    // Click the button
    cy.get( '#login-button' ).click();

    // Wait for the error message to be shown
    cy.wait( 3000 );

    // Check if the error message is shown on email-helper-text
    cy.get( '#email-helper-text' ).should( 'be.visible' ).and( 'contain.text', 'Email ou Senha inválida' );
  } );
} );
