import { Page } from "puppeteer";

export const getAbout = async (page: Page) => {
  return page.$$eval(".normal_header:nth-of-type(1)", ([nameElement]) => {
    let about = "";

    let currentSynopsisElement = nameElement.nextSibling;

    while (currentSynopsisElement) {
      if (
        currentSynopsisElement instanceof Element &&
        currentSynopsisElement.tagName === "DIV"
      )
        break;

      about += currentSynopsisElement.textContent;

      currentSynopsisElement = currentSynopsisElement.nextSibling;
    }

    return about === "No biography written." ? null : about;
  });
};
