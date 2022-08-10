import { ProtocolError, TimeoutError } from "puppeteer";
import { Anime } from "./Anime";
import { Character } from "./Character";
import { Person } from "./Person";

type MALWebResponse<T> = {
  status: number;
  data: T;
};

export type AnimeResponse = MALWebResponse<Anime>;
export type CharacterResponse = MALWebResponse<Character>;
export type PersonResponse = MALWebResponse<Person>;
export type ErrorResponse = MALWebResponse<{
  stack: string;
  message: string;
}>;
