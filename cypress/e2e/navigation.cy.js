describe("Navigations", () => {
  it("Home Navigation - Desktop", () => {
    cy.viewport(1920, 1080);

    cy.visit("/");

    cy.contains("Homebase").click();

    cy.contains("Our Mission");
  });

  it("Planets Navigation - Desktop", () => {
    cy.viewport(1920, 1080);

    cy.visit("/");

    cy.get('a[href*="planets"]').click();

    cy.url().should("include", "/planets");

    cy.contains("Planet Type");
    cy.contains("Gravity");
  });

  it("Destinations Navigation - Desktop", () => {
    cy.viewport(1920, 1080);

    cy.visit("/");

    cy.get('a[href*="destinations"]').click();

    cy.url().should("include", "/destinations");

    cy.contains("Planet Type");
    cy.contains("Gravity");
  });

  it("Rockets Navigation - Desktop", () => {
    cy.viewport(1920, 1080);

    cy.visit("/");

    cy.get('a[href*="rockets"]').click();

    cy.url().should("include", "/rockets");

    cy.contains("Base Cost");
    cy.contains("Dist Cost");
    cy.contains("Autonomy");
    cy.contains("Max Speed");
    cy.contains("Power");
  });

  it("Launches Navigation - Desktop", () => {
    cy.viewport(1920, 1080);

    cy.visit("/");

    cy.get('a[href*="launches"]').click();

    cy.url().should("include", "/launches");

    cy.contains("Distance");
    cy.contains("Cost");
    cy.contains("Duration");
    cy.contains("Date");
  });
});
