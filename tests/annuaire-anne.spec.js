import { test, expect } from "@playwright/test";

test.describe("Changer le rôle d'un employé: promouvoir", () => {
  // test BDON-30
  test("test BDON-30", async ({ page }) => {
    // Etape 1
    // Visiter le site
    await page.goto("https://bugcorp.vercel.app/");
    //Dans le bandeau de gauche, "Accueil" apparaît sur un fond bleu
    await expect(page.getByTestId("nav-home")).toBeVisible();
    // la page affiche "Bienvenue chez BugCorp"
    await page.getByRole("heading", { name: "Bienvenue chez BugCorp" }).click();

    // Etape 2
    //Cliquer sur "L’Annuaire" sur le bandeau de gauche.
    await page.getByTestId("nav-directory").click();
    // La page ayant pour titre "L’annuaire Enterprise" s’affiche.
    await expect(
      page.getByRole("heading", { name: "L'Annuaire Enterprise" })
    ).toBeVisible();
    //  Elle contient :un encart nommé "Objectif d'économies (restructuration)
    await expect(
      page.getByRole("heading", { name: "Objectif d'Économies (" })
    ).toBeVisible();
    //avec en dessous, un montant en euro
    await expect(page.locator("#target-savings-value")).toContainText("€");

    // Etape 3
    // Placer la souris au croisement de la ligne correspondant à l’ID de l'employé sélectionné et de la colonne "actions".
    // ID à tester: #1015 Alan Turing - rôle de base: Coffee maker
    // pour atteindre l'employé sur lequel porte le test => taper "Alan" dans la barre de recherche
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("Alan");
    // la liste doit afficher l'employé à tester et son rôle
    await expect(page.locator("#cell-name-1015")).toContainText("Alan Turing");
    await expect(page.locator("#cell-role-1015")).toContainText("Coffee Maker");
    // au survol avec la souris, le bouton "promouvoir" doit apparaître
    await page.getByTestId("promote-btn-1015").hover();
    await expect(page.getByTestId("promote-btn-1015")).toBeVisible();
    // BUGS doit être égal à -44
    await expect(page.getByText("-44")).toBeVisible();
    // L’encart  objectif d'économie indique: OBJECTIF D’ECONOMIES = 0€ / "objectif d'économie défini"
    await page.getByText("0 €", { exact: true }).click();

    // Etape 4
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    //Le nom du rôle situé sous l’identité de l’employé change pour devenir: Prompt Engineer
    await expect(page.locator("#cell-role-1015")).toContainText(
      "Prompt Engineer"
    );
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-44");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié (diminué de 15000€)
    await expect(page.locator("#current-savings-value")).toContainText(
      "-15 000 €"
    );

    // Etape 5
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Scapegoat
    await expect(page.locator("#cell-role-1015")).toContainText("Scapegoat");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-54");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-30 000 €"
    );

    // Etape 6
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Intern
    await expect(page.locator("#cell-role-1015")).toContainText("Intern");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-64");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-45 000 €"
    );

    // Etape 7
    // Cliquer sur l’icône apparaissant sous la forme d’un bouton contenant une flèche verte en escalier vers le haut.
    await page.getByTestId("promote-btn-1015").click();
    // Le nom du rôle situé sous l’identité de l’employé change pour devenir: Junior Dev
    await expect(page.locator("#cell-role-1015")).toContainText("Junior Dev");
    // le nombre de bugs a changé
    await expect(page.locator("#cell-bugs-1015")).not.toHaveText("-74");
    // le  montant inscrit sous objectif d'économie selon le montant prévu est modifié
    await expect(page.locator("#current-savings-value")).toContainText(
      "-60 000 €"
    );
  });
});
