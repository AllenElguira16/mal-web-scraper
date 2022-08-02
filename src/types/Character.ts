export type Character = {
  character_id: number;
  about: string | null;
  anime: AnimeOfCharacter[];
  manga: MangaOfCharacter[];
  voice_actors: VoiceActorOfCharacter[];
  native_name: string | null;
  english_name: string;
  picture: string | null;
};

export type AnimeOfCharacter = {
  anime_id: number;
  title: string;
  role: string;
  picture: string | null;
};

export type MangaOfCharacter = {
  manga_id: number;
  title: string;
  role: string;
  picture: string | null;
};

export type VoiceActorOfCharacter = {
  person_id: number;
  name: string;
  picture: string | null;
  language: string;
};
