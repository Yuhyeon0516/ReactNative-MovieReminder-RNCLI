import axios from 'axios';
import {Movie} from '../types';

const API_KEY = 'de49ced752214cb1dac456f369f8933a';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: API_KEY,
        language: 'ko-KR',
    },
});

interface MovieResponse {
    poster_path: string | null;
    overview: string;
    release_date: string;
    id: number;
    original_title: string;
    title: string;
}

interface GetDiscoverMoviesResponse {
    page: number;
    results: MovieResponse[];
    total_pages: number;
    total_results: number;
}

interface GetDiscoverMoviesProps {
    releaseDateGte?: string;
    releaseDateLte?: string;
}

export async function getDiscoverMovies({
    releaseDateGte,
    releaseDateLte,
}: GetDiscoverMoviesProps) {
    // 개봉 예정 영화
    const response = await instance.get<GetDiscoverMoviesResponse>(
        '/discover/movie',
        {
            params: {
                ['release_date.gte']: releaseDateGte,
                ['release_date.lte']: releaseDateLte,
            },
        },
    );

    const movies: Movie[] = response.data.results.map<Movie>(r => ({
        title: r.title,
        originalTitle: r.original_title,
        releaseDate: r.release_date,
        overview: r.overview,
        posterUrl: r.poster_path ? `${IMG_BASE_URL}${r.poster_path}` : null,
    }));

    return {
        page: response.data.page,
        results: movies,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
    };
}
