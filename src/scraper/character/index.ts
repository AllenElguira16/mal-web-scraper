import { createPage, scrollToBottom, skipBot } from "../../helpers";
import { getAnime } from "./getAnime";
import { getManga } from "./getManga";
import { getNames } from "./getNames";
import { getAbout } from "./getAbout";
import { getVoiceActors } from "./getVoiceActors";
import { Character } from "../../types";

export const character = (characterId: number) =>
  createPage(async (page): Promise<Character> => {
    await page.goto(`https://myanimelist.net/character/${characterId}`, {
      waitUntil: "domcontentloaded",
      timeout: 50000,
    });

    await skipBot(page);

    await scrollToBottom(page);

    await page.waitForSelector(".normal_header:nth-of-type(1)");

    const names = await getNames(page);

    const about = await getAbout(page);

    const picture = await page.$$eval(
      ".borderClass img:nth-of-type(1)",
      ([imgNode]) => imgNode?.getAttribute("data-src") || null
    );

    return {
      character_id: characterId,
      ...names,
      about,
      picture,
      anime: await getAnime(page),
      manga: await getManga(page),
      voice_actors: await getVoiceActors(page),
    };
  });
