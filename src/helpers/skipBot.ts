import { Page } from "puppeteer";
import { timeout } from "./timeout";

export const skipBot = async (page: Page) => {
  let isPageCaptcha = await page.evaluate(
    () => !!document.querySelector('.g-recaptcha[data-action="submit"]')
  );

  if (isPageCaptcha) {
    console.log("error here");
    await page.click('.g-recaptcha[data-action="submit"]');

    await timeout(10000);
  }

  isPageCaptcha = await page.evaluate(
    () => !!document.querySelector('.g-recaptcha[data-action="submit"]')
  );

  if (isPageCaptcha) await skipBot(page);
};
