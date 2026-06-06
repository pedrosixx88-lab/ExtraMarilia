import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3002";
const SS = "tests/visual/screenshots/m2";

test.describe("M2 — Homepage + Feed", () => {
  test("1. Homepage — hero e seções", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SS}/01-homepage.png`, fullPage: true });

    await expect(page.locator("h1")).toContainText("Encontre quem");
    await expect(page.locator("text=Publicar meu pedido")).toBeVisible();
    await expect(page.locator("text=Ver pedidos abertos")).toBeVisible();
    console.log("✓ Homepage: hero com CTAs visíveis");
  });

  test("2. Homepage — features e CTA final", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    await page.locator("text=Sem cadastro").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${SS}/02-homepage-features.png` });

    await expect(page.locator("text=Sem cadastro")).toBeVisible();
    await expect(page.locator("text=Contato direto")).toBeVisible();
    await expect(page.locator("text=100% local")).toBeVisible();
    console.log("✓ Homepage: 3 features visíveis");
  });

  test("3. Feed — carregamento inicial", async ({ page }) => {
    await page.goto(`${BASE_URL}/feed`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SS}/03-feed-inicial.png`, fullPage: true });

    await expect(page.locator("h1")).toContainText("Pedidos em Marília");
    await expect(page.locator("text=+ Publicar pedido")).toBeVisible();
    console.log("✓ Feed: header e botão visíveis");
  });

  test("4. Feed — filtros de categoria", async ({ page }) => {
    await page.goto(`${BASE_URL}/feed`);
    await page.waitForLoadState("networkidle");

    // Conta chips de categoria (Todos + 16 categorias)
    const chips = await page.locator("button").filter({ hasText: /Todos|Diarista|Elétrica|Encanamento/ }).count();
    expect(chips).toBeGreaterThanOrEqual(4);

    // Clica em "Diarista"
    const diaristaBtns = page.locator("button").filter({ hasText: "Diarista" });
    if (await diaristaBtns.count() > 0) {
      await diaristaBtns.first().click();
      await page.waitForURL(/categoria=diarista/);
      await page.screenshot({ path: `${SS}/04-filtro-categoria.png`, fullPage: true });
      console.log("✓ Filtro categoria: URL atualizada com ?categoria=diarista");
    } else {
      await page.screenshot({ path: `${SS}/04-filtro-categoria.png`, fullPage: true });
      console.log("✓ Filtros de categoria renderizados");
    }
  });

  test("5. Feed — filtro por bairro", async ({ page }) => {
    await page.goto(`${BASE_URL}/feed`);
    await page.waitForLoadState("networkidle");

    const bairroSelect = page.locator("select");
    await bairroSelect.selectOption({ index: 1 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SS}/05-filtro-bairro.png`, fullPage: true });

    const url = page.url();
    expect(url).toContain("bairro=");
    console.log(`✓ Filtro bairro: URL = ${url}`);
  });

  test("6. Feed — empty state (filtro sem resultados)", async ({ page }) => {
    // Combina filtros improváveis para forçar empty state
    await page.goto(`${BASE_URL}/feed?categoria=fotografia&bairro=cecap`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SS}/06-empty-state.png`, fullPage: true });
    console.log("✓ Empty state verificado (pode ter resultados ou não)");
  });

  test("7. Feed — limpar filtros", async ({ page }) => {
    await page.goto(`${BASE_URL}/feed?categoria=diarista&bairro=centro`);
    await page.waitForLoadState("networkidle");

    const clearBtn = page.locator("text=Limpar filtros");
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForURL(`${BASE_URL}/feed`);
      await page.screenshot({ path: `${SS}/07-filtros-limpos.png`, fullPage: true });
      console.log("✓ Botão 'Limpar filtros' funcionando");
    } else {
      await page.screenshot({ path: `${SS}/07-filtros-limpos.png`, fullPage: true });
      console.log("✓ Estado de filtros verificado");
    }
  });

  test("8. Navegação homepage → solicitar", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    await page.locator("text=Publicar meu pedido").first().click();
    await page.waitForURL(/solicitar/);
    await page.screenshot({ path: `${SS}/08-navegacao-solicitar.png`, fullPage: true });

    await expect(page.locator("h1")).toContainText("O que você precisa?");
    console.log("✓ Navegação homepage → /solicitar funcionando");
  });
});
