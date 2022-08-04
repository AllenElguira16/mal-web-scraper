import { Page, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import path from "path";

import { minimal_args } from "../const";

export const createPage = async <T>(
  callback: (page: Page) => Promise<T>
): Promise<T> => {
  puppeteer.use(StealthPlugin());
  puppeteer.use(RecaptchaPlugin());
  puppeteer.use(
    AdblockerPlugin({
      interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
    })
  );

  const browser = await puppeteer.launch({
    headless: true,
    args: minimal_args,
    userDataDir: path.resolve(__dirname, "../../.cache"),
  });

  try {
    // Create a new incognito browser context.
    const context = await browser.createIncognitoBrowserContext();
    // Create a new page in a pristine context.
    const page = await context.newPage();

    const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

    await page.setRequestInterception(true);

    page.on("request", (request) => {
      const url = request.url();
      if (blocked_domains.some((domain) => url.includes(domain)))
        request.abort();
      else request.continue();
    });

    const data = await callback(page);

    await browser.close();

    return data;
  } catch (error) {
    await browser.close();

    throw error;
  }
};
