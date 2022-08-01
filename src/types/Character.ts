export type Character = {
  about: string | null;
  anime: AnimeOfCharacter[];
  manga: MangaOfCharacter[];
  voice_actors: VoiceActorOfCharacter[];
  native_name: string;
  english_name: string;
  character_id: number;
}

export type AnimeOfCharacter = {
  anime_id: number;
  title: string;
  role: string;
  picture: string;
}

export type MangaOfCharacter = {
  manga_id: number;
  title: string;
  role: string;
  picture: string;
}

export type VoiceActorOfCharacter = {
  person_id: number;
  name: string;
  picture: string;
  language: string;
}
