import { Page } from "puppeteer";
import { Anime } from "../../types";

export const getRelations = async (page: Page): Promise<Anime["relations"]> => {
  const [relationsElement] = await page.$x(
    '//h2[contains(text(), "Related Anime")]'
  );

  return (
    relationsElement?.evaluate((relationsNode) => {
      const tableElement = relationsNode.parentElement?.nextElementSibling;

      if (tableElement?.querySelectorAll("tr") === undefined) return [];

      const relations: Anime["relations"] = [];

      for (const trElement of Array.from(tableElement.querySelectorAll("tr"))) {
        const animeType = trElement.querySelector("td:nth-of-type(1)");
        const animeLinks = trElement.querySelector("td:nth-of-type(2)");

        animeLinks?.querySelectorAll("a").forEach((animeLink) => {
          const link = animeLink.getAttribute("href") as string;

          relations.push({
            type: animeType?.textContent?.slice(
              0,
              -1
            ) as Anime["relations"][number]["type"],
            anime_id: parseInt(link.split("/")[link.split("/").length - 2]),
            main_title: animeLink.textContent as string,
          });
        });
      }

      return relations;
    }) || []
  );
};
