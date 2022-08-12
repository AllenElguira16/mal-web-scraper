import {
  Browser,
  DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
  TimeoutError,
  ProtocolError,
  Page,
} from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import path from "path";

import { minimal_args } from "./const";

import { anime, character, person } from "./scraper";
import { FetchError, MALResponseError } from "./errors";
import { AnimeResponse, CharacterResponse, PersonResponse } from "./types";

export * from "./types";
export * from "./errors";

export default class MalWebScraper {
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

    // Close other existing connections
    await this.close();

    this.instance.browser = await puppeteer.launch({
      headless: true,
      args: minimal_args,
      userDataDir: path.resolve(__dirname, "../../.cache"),
    });

    // Create a new incognito browser context.
    const context = await this.instance.browser.createIncognitoBrowserContext();
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

    await this.instance.page.setCacheEnabled(false);

    return this.instance;
  }

  private static handleError = (id: number, error: unknown) => {
    if (error instanceof TimeoutError) {
      throw new MALResponseError(408, id, error.message);
    } else if (error instanceof ProtocolError) {
      throw new MALResponseError(403, id, error.message);
    } else if (error instanceof FetchError) {
      throw new MALResponseError(404, id, (error as Error).message);
    } else {
      throw error;
    }
  };

  public static async anime(id: number): Promise<AnimeResponse> {
    try {
      return {
        status: 200,
        data: await anime(this.instance!.page, id),
      };
    } catch (error) {
      return this.handleError(id, error);
    }
  }

  public static async character(id: number): Promise<CharacterResponse> {
    try {
      return {
        status: 200,
        data: await character(this.instance!.page, id),
      };
    } catch (error) {
      return this.handleError(id, error);
    }
  }

  public static async person(id: number): Promise<PersonResponse> {
    try {
      return {
        status: 200,
        data: await person(this.instance!.page, id),
      };
    } catch (error) {
      return this.handleError(id, error);
    }
  }

  public static async close() {
    await this.instance!.page?.close();
    await this.instance!.browser?.close();
  }
}
