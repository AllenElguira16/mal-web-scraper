export type Anime = {
  anime_id: number;
  info: {
    main_title: string;
    alternative_titles: Record<string, string>;
    synonyms: string[];
    episodes: number | null;
    type: string | null;
    aired: string | null;
    status: string | null;
    premiered: string | null;
    broadcast: string | null;
    producers: string[];
    licensors: string[];
    studios: string[];
    source: string | null;
    genres: string[];
    themes: string[];
    demographics: string[];
    duration: string | null;
    rating: string | null;
    synopsis: string | null;
    background: string | null;
    pictures: string[];
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
