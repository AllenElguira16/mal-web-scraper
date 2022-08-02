import { Page } from "puppeteer-core";

export const getManga = (page: Page) => {
  return page.$$eval(
    ".normal_header:nth-of-type(5) + table",
    ([mangaTableElement]) => {
      const manga: {
        manga_id: number;
        title: string;
        role: string;
        picture: string | null;
      }[] = [];

      mangaTableElement?.querySelectorAll("tr").forEach((mangaRowElement) => {
        const mangaLink = mangaRowElement
          .querySelector("td:nth-of-type(1) a")
          ?.getAttribute("href") as string;

        const mangaPicture =
          mangaRowElement
            .querySelector("td:nth-of-type(1) img")
            ?.getAttribute("data-src") || null;

        const title = mangaRowElement.querySelector("td:nth-of-type(2) a")
          ?.textContent as string;
        const role = mangaRowElement.querySelector(
          "td:nth-of-type(2) .spaceit_pad small"
        )?.textContent as string;

        manga.push({
          manga_id: parseInt(
            mangaLink.split("/")[mangaLink.split("/").length - 2]
          ),
          title,
          role,
          picture: mangaPicture,
        });
      });

      return manga;
    }
  );
};
