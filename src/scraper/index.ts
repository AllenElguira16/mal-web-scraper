import { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import path from "path";

import { minimal_args } from "../const";

import { anime } from "./anime";
import { character } from "./character";
import { person } from "./person";

const MalWebScraper = async () => {
  puppeteer.use(StealthPlugin());
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

  return {
    anime: (id: number) => anime(page, id),
    character: (id: number) => character(page, id),
    person: (id: number) => person(page, id),
    async close() {
      await page.close();
      await browser.close();
    },
  };
};

export default MalWebScraper;
