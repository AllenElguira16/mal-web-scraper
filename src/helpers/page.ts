import { Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import path from "path";

import { minimal_args } from "../const";

export const createPage = async <T>(callback: (page: Page) => Promise<T>) => {
  puppeteer.use(StealthPlugin());
  puppeteer.use(RecaptchaPlugin());

  const browser = await puppeteer.launch({
    headless: true,
    args: minimal_args,
    userDataDir: path.resolve(__dirname, "../../.cache"),
  });
  // Create a new incognito browser context.
  const context = await browser.createIncognitoBrowserContext();
  // Create a new page in a pristine context.
  const page = await context.newPage();

  const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

  await page.setRequestInterception(true);

  page.on("request", (request) => {
    const url = request.url();
    if (blocked_domains.some((domain) => url.includes(domain))) request.abort();
    else request.continue();
  });

  const isPageCaptcha = await page.evaluate(() => {
    return !!document.querySelector('.g-recaptcha[data-action="submit"]');
  });

  if (isPageCaptcha) await page.click('.g-recaptcha[data-action="submit"]');

  await page.waitForFunction(() => document.readyState === "complete");

  const data = await callback(page);

  await browser.close();

  return data;
};
