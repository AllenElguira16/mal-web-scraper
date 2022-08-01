# mal-web-scraper

A Web Scraper for MyAnimeList

==========

# Get Info Using MAL_ID

## Get Anime Full Info by AnimeID

```ts
import mal from "myanimelist-scraper";

const main = async () => {
  const id = 1; // Cowboy Bebop AnimeID

  console.log(await mal.anime(1));
};

main();
```

### Type Definitions for Anime

```ts
export type Anime = {
  anime_id: number;
  info: {
    main_title: {
      english: string | null;
      romanized: string | null;
    };
    alternative_titles: Record<string, string>;
    episodes: number | null;
    synonyms: string[];
    type: string | null;
    status: string | null;
    aired: string | null;
    premiered: string[];
    broadcast: string[];
    producers: string[];
    licensors: string[];
    studios: string[];
    source: string | null;
    genres: string[];
    themes: string[];
    duration: string | null;
    rating: string | null;
    synopsis: string | null;
    background: string | null;
  };
  characters: CharacterOnAnime[];
  staffs: StaffOnAnime[];
};

export type CharacterOnAnime = {
  character_id: number;
  name: string;
  role: string;
  picture: string | null;
  voice_actors: VoiceActorOfCharacterOnAnime[];
};

export type VoiceActorOfCharacterOnAnime = {
  person_id: number;
  name: string;
  language: string;
};

export type StaffOnAnime = {
  staff_id: number;
  name: string;
  role: string[];
  picture: string | null;
};
```

## Get Character Full Info by CharacterID

```ts
import mal from "myanimelist-scraper";

const main = async () => {
  const id = 1; // Spike Spiegel CharacterID

  console.log(await mal.character(1));
};

main();
```

### Type Definitions for Character

```ts
export type Character = {
  about: string | null;
  anime: AnimeOfCharacter[];
  manga: MangaOfCharacter[];
  voice_actors: VoiceActorOfCharacter[];
  native_name: string;
  english_name: string;
  character_id: number;
};

export type AnimeOfCharacter = {
  anime_id: number;
  title: string;
  role: string;
  picture: string;
};

export type MangaOfCharacter = {
  manga_id: number;
  title: string;
  role: string;
  picture: string;
};

export type VoiceActorOfCharacter = {
  person_id: number;
  name: string;
  picture: string;
  language: string;
};
```

## Get Person Info by PersonID

```ts
import mal from "myanimelist-scraper";

const main = async () => {
  const id = 1; // Seki, Tomokazu Person

  console.log(await mal.person(1));
};

main();
```

### Type Definitions for Person

```ts
export type Person = {
  person_id: number;
  english_name: string;
  native_name: string | null;
  birthday: string | null;
  picture: string | null;
  anime: AnimeOfPerson[];
  staff: StaffOfPerson[];
};

export type AnimeOfPerson = {
  anime_id: number;
  title: string;
  role: string;
  picture: string;
  character: {
    character_id: number;
    name: string;
    picture: string;
  };
};

export type StaffOfPerson = {
  anime_id: number;
  title: string;
  position: string;
  picture: string;
};
```
