import { Page } from "puppeteer";
import { VoiceActorOfCharacter } from "../../types";

export const getVoiceActors = (page: Page) => {
  return page.$$eval(
    ".normal_header:nth-of-type(1) ~ table tr",
    (vaRowElements) => {
      const va: VoiceActorOfCharacter[] = [];

      vaRowElements.forEach((vaRowElement) => {
        const vaLink = vaRowElement
          .querySelector("td:nth-of-type(1) a")
          ?.getAttribute("href") as string;

        const vaPicture = vaRowElement
          .querySelector("td:nth-of-type(1) img")
          ?.getAttribute("data-src") as string;

        const name = vaRowElement.querySelector("td:nth-of-type(2) > a")
          ?.textContent as string;

        const language = vaRowElement.querySelector(
          "td:nth-of-type(2) div small"
        )?.textContent as string;

        va.push({
          person_id: parseInt(vaLink.split("/")[vaLink.split("/").length - 2]),
          name: name,
          picture: vaPicture,
          language: language,
        });
      });

      return va;
    }
  );
};