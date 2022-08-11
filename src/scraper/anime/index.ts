import { skipBot } from "../../helpers";
import { getCharactersOfAnime } from "./getCharactersOfAnime";
import { getStaffsOfAnime } from "./getStaffsOfAnime";
import { Anime } from "../../types/Anime";
import { getInfo } from "./getInfo";
import { Page } from "puppeteer";
import { getRelations } from "./getRelations";

export const anime = async (page: Page, animeMalID: number): Promise<Anime> => {
  const response = await page.goto(
    `https://myanimelist.net/anime/${animeMalID}`,
    {
      waitUntil: "domcontentloaded",
      timeout: 50000,
    }
  );

  await skipBot(page);

  if (response?.status() === 404) {
    throw new Error(`Anime not found`);
  }

  const [pendingAnimeNode] = await page.$x(
    '//span[contains(text(), "This anime is pending approval.")]'
  );

  if (!!pendingAnimeNode) throw new Error(`Anime not found`);

  const link = await page.$$eval(
    ".breadcrumb > .di-ib:nth-of-type(3) > a",
    ([e]) => e?.getAttribute("href")
  );

  const info = await getInfo(page);
  const relations = await getRelations(page);

  await page.goto(`${link}/characters`, {
    waitUntil: "domcontentloaded",
    timeout: 50000,
  });

  const characters = await getCharactersOfAnime(page);
  const staffs = await getStaffsOfAnime(page);

  return {
    anime_id: animeMalID,
    info,
    ...relations,
    characters,
    staffs,
  };
};
