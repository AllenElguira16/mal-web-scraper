import { Page } from "puppeteer";
import { Anime } from "../../types";

export const getRelations = async (
  page: Page
): Promise<Pick<Anime, "anime_relations" | "manga_relations">> => {
  const [relationsElement] = await page.$x(
    '//h2[contains(text(), "Related Anime")]'
  );

  return (
    relationsElement?.evaluate((relationsNode) => {
      const tableElement = relationsNode.parentElement?.nextElementSibling;

      if (tableElement?.querySelectorAll("tr") === undefined)
        return {
          anime_relations: [],
          manga_relations: [],
        };

      const animeRelations: Anime["anime_relations"] = [];
      const mangaRelations: Anime["manga_relations"] = [];

      for (const trElement of Array.from(tableElement.querySelectorAll("tr"))) {
        const animeTypeElement = trElement.querySelector("td:nth-of-type(1)");
        const animeLinksElement = trElement.querySelector("td:nth-of-type(2)");

        const animeType = animeTypeElement?.textContent?.slice(0, -1) as
          | "Other"
          | "Prequel"
          | "Sequel"
          | "Adaptation";

        animeLinksElement?.querySelectorAll("a").forEach((animeLinkElement) => {
          const animeLink = animeLinkElement.getAttribute("href") as string;

          if (animeType === "Adaptation") {
            mangaRelations.push({
              type: "Adaptation",
              manga_id: parseInt(
                animeLink.split("/")[animeLink.split("/").length - 2]
              ),
              main_title: animeLinkElement.textContent as string,
            });
          } else {
            animeRelations.push({
              type: animeType,
              anime_id: parseInt(
                animeLink.split("/")[animeLink.split("/").length - 2]
              ),
              main_title: animeLinkElement.textContent as string,
            });
          }
        });
      }

      return {
        anime_relations: animeRelations,
        manga_relations: mangaRelations,
      };
    }) || {
      anime_relations: [],
      manga_relations: [],
    }
  );
};
