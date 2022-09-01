import { Page } from "puppeteer";

export const getAbout = async (page: Page) => {
  return page.$$eval(".normal_header:nth-of-type(1)", ([nameElement]) => {
    let about = "";

    let currentSynopsisElement = nameElement?.nextSibling || null;

    while (currentSynopsisElement) {
      if (
        (currentSynopsisElement instanceof Element &&
          currentSynopsisElement.tagName === "DIV" &&
          currentSynopsisElement.classList.contains("normal_header")) ||
        currentSynopsisElement.textContent === null
      )
        break;

      if (
        currentSynopsisElement instanceof Element &&
        currentSynopsisElement.classList.contains("spoiler")
      )
        about += `<div class="spoiler"><button>Toggle Spoiler</button>`;

      if (currentSynopsisElement.textContent.trim().length !== 0) {
        about += `<div>${currentSynopsisElement.textContent}</div>`;
      }

      if (
        currentSynopsisElement instanceof Element &&
        currentSynopsisElement.classList.contains("spoiler")
      )
        about += "</div>";

      currentSynopsisElement = currentSynopsisElement.nextSibling;
    }

    return about === "No biography written." ? null : about.trim();
  });
};
