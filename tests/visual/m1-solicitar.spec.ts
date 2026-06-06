import { test, expect } from "@playwright/test";
import path from "path";

const BASE_URL = "http://localhost:3001";
const SCREENSHOTS_DIR = "tests/visual/screenshots";

test.describe("M1 — Página /solicitar", () => {
  test("1. Carregamento inicial da página", async ({ page }) => {
    await page.goto(`${BASE_URL}/solicitar`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-pagina-inicial.png`, fullPage: true });

    // Verifica elementos essenciais
    await expect(page.locator("h1")).toHaveText("O que você precisa?");
    await expect(page.locator("#nome")).toBeVisible();
    await expect(page.locator("#whatsapp")).toBeVisible();
    await expect(page.locator("#category_id")).toBeVisible();
    await expect(page.locator("#bairro_id")).toBeVisible();
    await expect(page.locator("#descricao")).toBeVisible();
    await expect(page.locator("button[type=submit]")).toHaveText("Publicar pedido");

    console.log("✓ Página carregada com todos os campos");
  });

  test("2. Categorias e bairros carregados do banco", async ({ page }) => {
    await page.goto(`${BASE_URL}/solicitar`);
    await page.waitForLoadState("networkidle");

    const categoryOptions = await page.locator("#category_id option").count();
    const bairroOptions = await page.locator("#bairro_id option").count();

    // 16 categorias + 1 placeholder "Selecione..."
    expect(categoryOptions).toBe(17);
    // 21 bairros + 1 placeholder
    expect(bairroOptions).toBe(22);

    console.log(`✓ ${categoryOptions - 1} categorias e ${bairroOptions - 1} bairros carregados`);
  });

  test("3. Máscara do WhatsApp", async ({ page }) => {
    await page.goto(`${BASE_URL}/solicitar`);
    await page.waitForLoadState("networkidle");

    const whatsapp = page.locator("#whatsapp");
    await whatsapp.click();
    await whatsapp.type("14999991234");
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-mascara-whatsapp.png` });

    const value = await whatsapp.inputValue();
    expect(value).toBe("(14) 99999-1234");
    console.log(`✓ Máscara aplicada: "${value}"`);
  });

  test("4. Validação de campos obrigatórios", async ({ page }) => {
    await page.goto(`${BASE_URL}/solicitar`);
    await page.waitForLoadState("networkidle");

    // Submete sem preencher nada
    await page.locator("button[type=submit]").click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-erros-validacao.png`, fullPage: true });

    // Deve mostrar erros
    const errorMessages = await page.locator(".text-red-500").count();
    expect(errorMessages).toBeGreaterThan(0);
    console.log(`✓ ${errorMessages} mensagens de erro exibidas`);
  });

  test("5. Checkbox urgente — destaque visual", async ({ page }) => {
    await page.goto(`${BASE_URL}/solicitar`);
    await page.waitForLoadState("networkidle");

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/05a-urgente-desmarcado.png` });

    // Clica no container do urgente
    await page.locator("text=É urgente?").click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/05b-urgente-marcado.png` });

    // Verifica badge "Urgente" apareceu
    const urgenteBadge = page.locator("text=Urgente").first();
    await expect(urgenteBadge).toBeVisible();
    console.log("✓ Badge 'Urgente' visível após marcar checkbox");
  });

  test("6. Submit completo — caminho feliz", async ({ page }) => {
    await page.goto(`${BASE_URL}/solicitar`);
    await page.waitForLoadState("networkidle");

    // Preenche todos os campos
    await page.locator("#nome").fill("Maria Teste");
    await page.locator("#whatsapp").type("14988887777");
    await page.locator("#category_id").selectOption({ index: 1 });
    await page.locator("#bairro_id").selectOption({ index: 1 });
    await page.locator("#descricao").fill(
      "Preciso de uma diarista para limpar apartamento de 2 quartos no sábado pela manhã."
    );

    await page.screenshot({ path: `${SCREENSHOTS_DIR}/06a-formulario-preenchido.png`, fullPage: true });

    // Submete
    await page.locator("button[type=submit]").click();

    // Aguarda resposta da API
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/06b-sucesso.png`, fullPage: true });

    // Verifica tela de sucesso
    await expect(page.locator("text=Pedido enviado!")).toBeVisible();
    console.log("✓ Tela de sucesso exibida após submit");
  });

  test("7. Erro de API — rate limit ou falha", async ({ page }) => {
    await page.goto(`${BASE_URL}/solicitar`);
    await page.waitForLoadState("networkidle");

    // Intercepta a API para simular erro
    await page.route("**/api/requests", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Erro ao salvar pedido. Tente novamente." }),
      });
    });

    await page.locator("#nome").fill("Erro Teste");
    await page.locator("#whatsapp").type("14988887777");
    await page.locator("#category_id").selectOption({ index: 1 });
    await page.locator("#bairro_id").selectOption({ index: 1 });
    await page.locator("#descricao").fill("Teste de erro na API para verificar banner de erro.");

    await page.locator("button[type=submit]").click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-erro-api.png`, fullPage: true });

    // Banner de erro deve aparecer
    const errorBanner = page.locator("text=Erro ao salvar pedido");
    await expect(errorBanner).toBeVisible();
    console.log("✓ Banner de erro exibido corretamente");
  });
});
