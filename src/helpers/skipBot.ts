import { Page } from "puppeteer";

export const skipBot = async (page: Page) => {
  const isPageCaptcha = await page.evaluate(
    () => !!document.querySelector('.g-recaptcha[data-action="submit"]')
  );

  if (isPageCaptcha) {
    await page.click('.g-recaptcha[data-action="submit"]');

    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 50000 });

    await page.click('.g-recaptcha[data-action="submit"]');

    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 50000 });

    await page.reload({ waitUntil: "networkidle2", timeout: 50000 });
  }
};
