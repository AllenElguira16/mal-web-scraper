import { Page } from "puppeteer-core";
import { Anime } from "../../types";

export const getRightSideInfo = async (
  page: Page
): Promise<Pick<Anime["info"], "synopsis" | "background">> => {
  return {
    synopsis: await page.$$eval(
      ".rightside [itemprop=description]",
      ([synopsisElement]) => {
        return synopsisElement.textContent;
      }
    ),
    background: await page.$$eval(
      ".rightside [itemprop=description] + div",
      ([synopsisElement]) => {
        let currentElement: Element | ChildNode | null | undefined =
          synopsisElement.nextSibling;
        let background = "";

        while (
          !(
            currentElement instanceof Element &&
            currentElement.classList.contains("border_top")
          )
        ) {
          if (currentElement) background += currentElement.textContent;

          currentElement = currentElement?.nextSibling;
        }

        return background;
      }
    ),
  };
};
