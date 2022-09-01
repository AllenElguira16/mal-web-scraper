import { scrollToBottom, skipBot } from "../../helpers";
import { getAnime } from "./getAnime";
import { getManga } from "./getManga";
import { getNames } from "./getNames";
import { getAbout } from "./getAbout";
import { getVoiceActors } from "./getVoiceActors";
import { Character } from "../../types";
import { Page } from "puppeteer";
import { FetchError } from "../../errors";

export const character = async (
  page: Page,
  characterId: number
): Promise<Character> => {
  const response = await page.goto(
    `https://myanimelist.net/character/${characterId}`,
    {
      waitUntil: "domcontentloaded",
      timeout: 50000,
    }
  );

  await skipBot(page);

  if (response?.status() === 404) {
    throw new FetchError(`Character not found`);
  }

  await scrollToBottom(page);

  const names = await getNames(page);

  const about = await getAbout(page);

  const picture = await page.$$eval(
    "#content > table > tbody > tr > td:nth-of-type(1).borderClass > div > a > img",
    ([imgNode]) => imgNode?.getAttribute("data-src") || null
  );

  const [birthDateElement] = await page.$x(
    '//text()[contains(., "Birthday:")]'
  );

  const birthDate =
    (await birthDateElement?.evaluate(
      (birthDateNode) => birthDateNode.textContent
    )) || null;

  return {
    character_id: characterId,
    ...names,
    about,
    picture,
    birthday: birthDate,
    anime: await getAnime(page),
    manga: await getManga(page),
    voice_actors: await getVoiceActors(page),
  };
};
