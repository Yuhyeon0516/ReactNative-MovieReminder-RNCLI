export type RootStackParamList = {
    Movies: undefined;
    Detail: {id: number};
};

export interface Movie {
    id: number;
    title: string;
    originalTitle: string;
    releaseDate: string;
    overview: string;
    posterUrl: string | null;
}
