describe( "Non auth redirect to login", () => {

  const pathsToTest = [
    "/",
    "/clientes",
    "/faq",
    "/manager",
    "/home",
    "/street",
  ]


  pathsToTest.forEach( ( path, index ) => {
    it( `should redirect unauthenticated users to /login when visiting ${path} and not store user data in localStorage`, () => {
      // Replace 'your_base_url' with your actual application's base URL
      const baseUrl = 'http://localhost:3000'; // or 'your_base_url'

      // Clear localStorage to ensure no user data exists
      cy.clearLocalStorage( 'b3_userData' ); // Replace 'your_user_data_key' with the actual key you use to store user data

      // Assert that the user data is not stored in localStorage
      cy.window()
        .its( 'localStorage' )
        .invoke( 'getItem', 'b3_userData' ) // Replace 'your_user_data_key' with the actual key you use to store user data
        .should( 'be.null' );

      cy.visit( `${baseUrl}${path}`, { failOnStatusCode: false } ); // Visit the specified path and allow Cypress not to fail on non-2xx status codes

      // Ensure the page is fully loaded before proceeding
      cy.document().its( 'readyState' ).should( 'eq', 'complete' );

      // Check if the URL is updated to '/login' after the redirection
      cy.url().should( 'include', '/login' );
    } );
  } );
} );
