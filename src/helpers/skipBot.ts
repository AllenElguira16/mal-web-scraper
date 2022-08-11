import { Page } from "puppeteer";

export const skipBot = async (page: Page) => {
  let isPageCaptcha = await page.evaluate(
    () => !!document.querySelector('.g-recaptcha[data-action="submit"]')
  );

  if (isPageCaptcha) {
    await page.click('.g-recaptcha[data-action="submit"]');

    await page.waitForNavigation();

    await page.click('.g-recaptcha[data-action="submit"]');

    await page.waitForNavigation();

    await page.reload();
  }

  isPageCaptcha = await page.evaluate(
    () => !!document.querySelector('.g-recaptcha[data-action="submit"]')
  );

  if (isPageCaptcha) await skipBot(page);
};
