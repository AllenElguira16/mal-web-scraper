import { Page } from "puppeteer-core";
import { AnimeOfPerson } from "../../types";

export const getAnime = async (page: Page) => {
  const [vaH2roleElement] = await page.$x(
    '//h2[contains(., "Voice Acting Roles")]'
  );

  return vaH2roleElement.evaluate((vaH2roleNode) => {
    const animeTableElement = (vaH2roleNode?.parentNode as Element | undefined)
      ?.nextElementSibling?.nextElementSibling;

    const anime: AnimeOfPerson[] = [];

    if (animeTableElement?.tagName === "TABLE") {
      animeTableElement
        .querySelectorAll("tbody > tr")
        .forEach((animeRowElement) => {
          const animeLink = animeRowElement
            .querySelector("td:nth-of-type(1) a")
            ?.getAttribute("href") as string;

          const animePicture = animeRowElement
            .querySelector("td:nth-of-type(1) img")
            ?.getAttribute("data-src") as string;

          const animeTitle = animeRowElement.querySelector(
            "td:nth-of-type(2) > .spaceit_pad:nth-of-type(1) > a"
          )?.textContent as string;

          const characterName = animeRowElement
            .querySelector("td:nth-of-type(3) .spaceit_pad:nth-of-type(1) a")
            ?.getAttribute("href") as string;

          const characterLink = animeRowElement.querySelector(
            "td:nth-of-type(3) .spaceit_pad:nth-of-type(1) a"
          )?.textContent as string;

          const characterRole = animeRowElement.querySelector(
            "td:nth-of-type(3) .spaceit_pad:nth-of-type(2)"
          )?.textContent as string;

          const characterPicture = animeRowElement
            .querySelector("td:nth-of-type(4) img")
            ?.getAttribute("data-src") as string;

          anime.push({
            anime_id: parseInt(
              animeLink.split("/")[animeLink.split("/").length - 2]
            ),
            picture: animePicture,
            role: characterRole.trim(),
            title: animeTitle,
            character: {
              character_id: parseInt(
                characterLink.split("/")[characterLink.split("/").length - 2]
              ),
              name: characterName,
              picture: characterPicture,
            },
          });
        });
    }

    return anime;
  });
};
