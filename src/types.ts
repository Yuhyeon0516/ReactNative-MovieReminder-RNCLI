export type RootStackParamList = {
    Movies: undefined;
    Detail: {id: number};
    Reminders: undefined;
};

export interface Movie {
    id: number;
    title: string;
    originalTitle: string;
    releaseDate: string;
    overview: string;
    posterUrl: string | null;
}
