import { Person } from "../../types";
import { createPage, scrollToBottom, skipBot } from "../../helpers";
import { getAnime } from "./getAnime";
import { getAnimeStaff } from "./getAnimeStaff";

export const person = async (personId: number) =>
  createPage(async (page): Promise<Person> => {
    await page.goto(`https://myanimelist.net/people/${personId}`, {
      waitUntil: "domcontentloaded",
      timeout: 50000,
    });

    await skipBot(page);

    await scrollToBottom(page);

    await page.waitForSelector(".title-name.h1_bold_none");

    const englishName = await page.$$eval(
      ".title-name.h1_bold_none",
      ([nameElement]) => nameElement?.textContent as string
    );

    const [givenNameElement] = await page.$x(
      '//*[contains(text(), "Given name:")]'
    );
    const [familyNameElement] = await page.$x(
      '//*[contains(text(), "Family name:")]'
    );
    const [, birthDateElement] = await page.$x(
      '//*[contains(text(), "Birthday:")]'
    );

    const givenName =
      (await givenNameElement?.evaluate((givenNameNode) =>
        givenNameNode.nextSibling?.textContent?.trim()
      )) || null;

    const familyName =
      (await familyNameElement?.evaluate((familyNameNode) =>
        familyNameNode.nextSibling?.textContent?.trim()
      )) || null;

    const birthDate =
      (await birthDateElement?.evaluate((birthDateNode) =>
        birthDateNode.nextSibling?.textContent?.trim()
      )) || null;

    const picture = await page.$$eval(
      "#content > table > tbody > tr > td:nth-of-type(1).borderClass > div > a > img",
      ([img]) => img?.getAttribute("data-src") || null
    );

    const anime = await getAnime(page);

    const staff = await getAnimeStaff(page);

    return {
      person_id: personId,
      english_name: englishName,
      native_name:
        givenName && familyName ? familyName + " " + givenName : null,
      birthday: birthDate === "Unknown" ? null : birthDate,
      picture,
      anime,
      staff,
    };
  });
