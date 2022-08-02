import { createPage } from "../../helpers";
import { getCharactersOfAnime } from "./getCharactersOfAnime";
import { getStaffsOfAnime } from "./getStaffsOfAnime";
import { Anime } from "../../types/Anime";
import { getInfo } from "./getInfo";

export const anime = async (malID: number) =>
  createPage(async (page): Promise<Anime> => {
    await page.goto(`https://myanimelist.net/anime/${malID}`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    const link = await page.$$eval(
      ".breadcrumb > .di-ib:nth-of-type(3) > a",
      ([e]) => e.getAttribute("href")
    );

    const info = await getInfo(page);

    await page.goto(`${link}/characters`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    const characters = await getCharactersOfAnime(page);
    const staffs = await getStaffsOfAnime(page);

    return {
      anime_id: malID,
      info,
      characters,
      staffs,
    };
  });
