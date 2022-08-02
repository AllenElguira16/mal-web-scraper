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
  picture: string | null;
  character: {
    character_id: number;
    name: string;
    picture: string | null;
  };
};

export type StaffOfPerson = {
  anime_id: number;
  title: string;
  position: string;
  picture: string | null;
};
