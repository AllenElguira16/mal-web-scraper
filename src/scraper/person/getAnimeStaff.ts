import { Page } from "puppeteer";
import { StaffOfPerson } from "../../types";

export const getAnimeStaff = async (page: Page) => {
  const [animeStaffH2roleElement] = await page.$x(
    '//*[contains(text(), "Anime Staff Positions")]'
  );

  return (
    animeStaffH2roleElement?.evaluate((animeStaffH2roleNode) => {
      const animeStaffTableElement = (animeStaffH2roleNode as Element)
        ?.nextElementSibling?.nextElementSibling;

      const staff: StaffOfPerson[] = [];

      if (animeStaffTableElement?.tagName === "TABLE") {
        animeStaffTableElement
          .querySelectorAll("tbody > tr")
          .forEach((animeRowElement) => {
            const animeLink = animeRowElement
              .querySelector("td:nth-of-type(1) a")
              ?.getAttribute("href") as string;

            const animePicture =
              animeRowElement
                .querySelector("td:nth-of-type(1) img")
                ?.getAttribute("data-src") || null;

            const animeTitle = animeRowElement.querySelector(
              "td:nth-of-type(2) > .spaceit_pad:nth-of-type(1) > a"
            )?.textContent as string;

            const staffPosition = animeRowElement.querySelector(
              "td:nth-of-type(2) .spaceit_pad:nth-of-type(2) small"
            )?.textContent as string;

            staff.push({
              anime_id: parseInt(
                animeLink.split("/")[animeLink.split("/").length - 2]
              ),
              picture: animePicture,
              position: staffPosition.trim(),
              title: animeTitle,
            });
          });
      }

      return staff;
    }) || []
  );
};
