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
import { serializeError } from "./helpers";
import {
  AnimeResponse,
  CharacterResponse,
  ErrorResponse,
  PersonResponse,
} from "./types";

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

  private static handleError = (error: unknown): ErrorResponse => {
    if (error instanceof TimeoutError) {
      return {
        status: 408,
        data: serializeError(error),
      };
    } else if (error instanceof ProtocolError) {
      return {
        status: 403,
        data: serializeError(error),
      };
    }

    return {
      status: 404,
      data: serializeError(error as Error),
    };
  };

  public static async anime(
    id: number
  ): Promise<AnimeResponse | ErrorResponse> {
    try {
      return {
        status: 200,
        data: await anime(this.instance!.page, id),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async character(
    id: number
  ): Promise<CharacterResponse | ErrorResponse> {
    try {
      return {
        status: 200,
        data: await character(this.instance!.page, id),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async person(
    id: number
  ): Promise<PersonResponse | ErrorResponse> {
    try {
      return {
        status: 200,
        data: await person(this.instance!.page, id),
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  public static async close() {
    await this.instance!.page.close();
    await this.instance!.browser.close();
  }
}

export default MalWebScraper;
export * from "./types";
