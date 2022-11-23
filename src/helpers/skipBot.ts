import { Page } from "puppeteer";
import { setTimeout } from "timers/promises";

export const skipBot = async (page: Page) => {
  // let isPageCaptcha = ;

  if (await recaptchaButtonExists(page)) {
    await page.click('.g-recaptcha[data-action="submit"]');

    await setTimeout(10000);
  }

  if (await recaptchaButtonExists(page)) await skipBot(page);
};

const recaptchaButtonExists = async (page: Page) =>
  page.evaluate(
    () => !!document.querySelector('.g-recaptcha[data-action="submit"]')
  );
