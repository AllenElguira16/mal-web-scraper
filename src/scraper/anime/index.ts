import { Page } from "puppeteer";
import { createPage } from "../../helpers/page";
import { getCharactersOfAnime } from "./getCharactersOfAnime";
import { getLeftSideInfo } from "./getLeftSideInfo";
import { getRightSideInfo } from "./getRightSideInfo";
import { getStaffsOfAnime } from "./getStaffsOfAnime";
import { Anime } from "../../types/Anime";

export const anime = async (malID: number) =>
  createPage(async (page): Promise<Anime> => {
    console.log(`https://myanimelist.net/anime/${malID}`);

    await page.goto(`https://myanimelist.net/anime/${malID}`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    const mainPageInfo = await getMainPageInfo(page);

    const link = await page.$$eval(
      ".breadcrumb > .di-ib:nth-of-type(3) > a",
      ([e]) => e.getAttribute("href")
    );

    await page.goto(`${link}/characters`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    const charactersOfAnime = await getCharactersOfAnime(page);
    const staffsOfAnime = await getStaffsOfAnime(page);

    return {
      anime_id: malID,
      info: mainPageInfo,
      characters: charactersOfAnime,
      staffs: staffsOfAnime,
    };
  });

const getMainPageInfo = async (page: Page): Promise<Anime['info']> => {
  const leftSideInfo = await getLeftSideInfo(page);
  const rightSideInfo = await getRightSideInfo(page);

  return {
    ...leftSideInfo,
    ...rightSideInfo,
  };
};
