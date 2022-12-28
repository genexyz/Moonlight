describe("Searches", () => {
  it("Planet Search - Earth", () => {
    cy.viewport(1920, 1080);

    cy.visit("/planets");

    cy.get("#search-bar").type("Ea");
    cy.get("#inline-checkbox-habitable").click();
    cy.get("#gravity-max-input").type("{backspace}").type("{backspace}").type("15");

    cy.contains("Earth").click();
    cy.contains("Human Race Origin");
  });

  it("Rocket Search - Electron", () => {
    cy.viewport(1920, 1080);

    cy.visit("/rockets");

    cy.get("#search-bar").type("El");
    cy.get("#power-max-input")
      .type("{backspace}")
      .type("{backspace}")
      .type("{backspace}")
      .type("45");
    cy.get("#dist-cost-max-input").type("{backspace}").type("1");

    cy.contains("Electron").click();
    cy.contains("Autonomy: ");
  });
});
