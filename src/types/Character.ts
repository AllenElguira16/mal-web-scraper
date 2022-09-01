export type Character = {
  character_id: number;
  about: string | null;
  english_name: string | null;
  kanji_name: string | null;
  birthday: string | null;
  nicknames: string[];
  picture: string | null;
  anime: AnimeOfCharacter[];
  manga: MangaOfCharacter[];
  voice_actors: VoiceActorOfCharacter[];
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
