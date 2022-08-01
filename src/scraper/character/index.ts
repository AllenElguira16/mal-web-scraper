import { createPage } from "../../helpers";
import { getAnime } from "./getAnime";
import { getManga } from "./getManga";
import { getNames } from "./getNames";
import { getAbout } from "./getAbout";
import { getVoiceActors } from "./getVoiceActors";

export const character = (characterId: number) =>
  createPage(async (page) => {
    await page.goto(`https://myanimelist.net/character/${characterId}`, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    const names = await getNames(page);

    const about = await getAbout(page);

    return {
      character_id: characterId,
      ...names,
      about,
      anime: await getAnime(page),
      manga: await getManga(page),
      voice_actors: await getVoiceActors(page),
    };
  });
