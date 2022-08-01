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
