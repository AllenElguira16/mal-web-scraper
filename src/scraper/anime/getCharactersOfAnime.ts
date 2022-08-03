import { Page } from "puppeteer";
import { CharacterOnAnime, VoiceActorOfCharacterOnAnime } from "../../types";

export const getCharactersOfAnime = async (
  page: Page
): Promise<CharacterOnAnime[]> => {
  return (
    await page.$$eval(
      ".anime-character-container.js-anime-character-container > table",
      (characterTablesElement): (CharacterOnAnime | undefined)[] => {
        return characterTablesElement.map((characterTableElement) => {
          const characterLink = characterTableElement
            .querySelector("td:nth-of-type(1) a")
            ?.getAttribute("href");

          const pictureLink =
            characterTableElement
              .querySelector("td:nth-of-type(1) a img")
              ?.getAttribute("data-src") || null;

          if (!characterLink || !pictureLink) return;

          const characterID =
            characterLink.split("/")[characterLink.split("/").length - 2];

          const name = characterTableElement.querySelector(
            "td:nth-of-type(2) h3"
          )?.textContent;

          if (!name) return;

          const role = characterTableElement
            .querySelector("tr > td:nth-of-type(2) > div:nth-of-type(4)")
            ?.textContent?.trim();

          if (!role) return;

          const voiceActors: VoiceActorOfCharacterOnAnime[] = [];

          characterTableElement
            .querySelectorAll("tr.js-anime-character-va-lang")
            .forEach((characterVAElement) => {
              const vaName = characterVAElement
                .querySelector(".spaceit_pad:nth-of-type(1)")
                ?.textContent?.trim();
              const vaLink = characterVAElement
                .querySelector(".spaceit_pad:nth-of-type(1) > a")
                ?.getAttribute("href");
              const language = characterVAElement
                .querySelector(".spaceit_pad:nth-of-type(2)")
                ?.textContent?.trim();

              const personId =
                vaLink?.split("/")[vaLink?.split("/").length - 2];

              if (!vaName || !language || !personId) return;

              voiceActors.push({
                person_id: parseInt(personId),
                name: vaName,
                language,
              });
            });

          return {
            character_id: parseInt(characterID),
            name,
            role,
            picture: pictureLink,
            voice_actors: voiceActors,
          };
        });
      }
    )
  ).filter((character): character is CharacterOnAnime => !!character);
};
