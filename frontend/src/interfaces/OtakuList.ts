import { Anime } from "./anime";

export interface OtakuList {
    id?: number;
    title: string;
    animes: Anime[];
    updated: Date;
}