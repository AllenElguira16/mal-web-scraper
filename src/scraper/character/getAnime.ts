import { Page } from "puppeteer-core";
import { AnimeOfCharacter } from "../../types";

export const getAnime = (page: Page) => {
  return page.$$eval(
    ".normal_header:nth-of-type(4) + table",
    ([animeTableElement]) => {
      const anime: AnimeOfCharacter[] = [];

      animeTableElement?.querySelectorAll("tr").forEach((animeRowElement) => {
        const animeLink = animeRowElement
          .querySelector("td:nth-of-type(1) a")
          ?.getAttribute("href") as string;

        const animePicture =
          animeRowElement
            .querySelector("td:nth-of-type(1) img")
            ?.getAttribute("data-src") || null;

        const title = animeRowElement.querySelector("td:nth-of-type(2) a")
          ?.textContent as string;
        const role = animeRowElement.querySelector(
          "td:nth-of-type(2) .spaceit_pad small"
        )?.textContent as string;

        anime.push({
          anime_id: parseInt(
            animeLink.split("/")[animeLink.split("/").length - 2]
          ),
          title,
          role,
          picture: animePicture,
        });
      });

      return anime;
    }
  );
};
