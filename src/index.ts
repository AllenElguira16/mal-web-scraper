import {
  Browser,
  DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
  Page,
} from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import path from "path";

import { minimal_args } from "./const";

import { anime, character, person } from "./scraper";

class MalWebScraper {
  private static instance?: MalWebScraper;
  private browser!: Browser;
  private page!: Page;

  private constructor() {
    puppeteer.use(StealthPlugin());
    puppeteer.use(
      AdblockerPlugin({
        interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
      })
    );
  }

  public static async init() {
    if (!this.instance) this.instance = new MalWebScraper();

    if (!this.instance.browser || !this.instance.page) {
      this.instance.browser = await puppeteer.launch({
        headless: true,
        args: minimal_args,
        userDataDir: path.resolve(__dirname, "../../.cache"),
      });

      // Create a new incognito browser context.
      const context =
        await this.instance.browser.createIncognitoBrowserContext();
      // Create a new page in a pristine context.
      this.instance.page = await context.newPage();

      const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

      await this.instance.page.setRequestInterception(true);

      this.instance.page.on("request", (request) => {
        const url = request.url();
        if (blocked_domains.some((domain) => url.includes(domain)))
          request.abort();
        else request.continue();
      });
    }

    return this.instance;
  }

  public static async anime(id: number) {
    return anime(this.instance!.page, id);
  }

  public static async character(id: number) {
    return character(this.instance!.page, id);
  }

  public static async person(id: number) {
    return person(this.instance!.page, id);
  }

  public static async close() {
    await this.instance!.page.close();
    await this.instance!.browser.close();
  }
}

export default MalWebScraper;
export * from "./types";
