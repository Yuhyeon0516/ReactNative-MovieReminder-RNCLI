import axios from 'axios';
import {Movie} from '../types';
import moment from 'moment';

const API_KEY = 'de49ced752214cb1dac456f369f8933a';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getImageUrl(path: string | null) {
    return path != null ? `${IMG_BASE_URL}${path}` : null;
}

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
    page?: number;
}

export async function getDiscoverMovies({
    releaseDateGte,
    releaseDateLte,
    page,
}: GetDiscoverMoviesProps) {
    const response = await instance.get<GetDiscoverMoviesResponse>(
        '/discover/movie',
        {
            params: {
                ['release_date.gte']: releaseDateGte,
                ['release_date.lte']: releaseDateLte,
                page: page,
                region: 'KR',
            },
        },
    );

    const movies: Movie[] = response.data.results.map<Movie>(r => ({
        id: r.id,
        title: r.title,
        originalTitle: r.original_title,
        releaseDate: r.release_date,
        overview: r.overview,
        posterUrl: getImageUrl(r.poster_path),
    }));

    return {
        page: response.data.page,
        results: movies,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
    };
}

interface GetCreditsResponse {
    cast: {
        id: number;
        known_for_department: string;
        name: string;
        profile_path: string | null;
        character: string;
    }[];
    crew: {
        id: number;
        known_for_department: string;
        name: string;
        profile_path: string | null;
        job: string;
    }[];
}

interface GetVideosResponse {
    results: {
        name: string;
        key: string;
        site: string;
        type: string;
        id: string;
    }[];
}

interface GetReleaseDatesResponse {
    id: number;
    results: {
        iso_3166_1: string;
        release_dates: {
            certification: string;
            iso_639_1: string;
            release_date: string;
            type: number;
            note: string;
        }[];
    }[];
}

interface GetMovieDetailsResponse {
    id: number;
    genres: {
        id: number;
        name: string;
    };
    title: string;
    original_title: string;
    overview: string | null;
    poster_path: string | null;
    release_date: string;
    runtime: string | null;
    credits: GetCreditsResponse;
    videos: GetVideosResponse;
    release_dates: GetReleaseDatesResponse;
}

interface GetMovieDetailsProps {
    id: number;
}

export async function getMovieDetails({id}: GetMovieDetailsProps) {
    const {data: movie} = await instance.get<GetMovieDetailsResponse>(
        `/movie/${id}`,
        {
            params: {
                append_to_response: 'credits,videos,release_dates',
            },
        },
    );

    const releaseDate = (() => {
        const releaseDateKR = movie.release_dates.results.find(
            r => r.iso_3166_1 === 'KR',
        )?.release_dates[0].release_date;

        if (releaseDateKR) {
            return moment(releaseDateKR).format('YYYY-MM-DD');
        }

        return movie.release_date;
    })();

    return {
        id: movie.id,
        genres: movie.genres,
        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        posterUrl: getImageUrl(movie.poster_path),
        releaseDate: releaseDate,
        runtime: movie.runtime,
        casts: movie.credits.cast.map(cast => ({
            id: cast.id,
            knownForDepartment: cast.known_for_department,
            name: cast.name,
            profileUrl: getImageUrl(cast.profile_path),
            character: cast.character,
        })),
        crews: movie.credits.crew.map(crew => ({
            id: crew.id,
            knownForDepartment: crew.known_for_department,
            name: crew.name,
            profileUrl: getImageUrl(crew.profile_path),
            job: crew.job,
        })),
        videos: movie.videos.results.map(video => ({
            name: video.name,
            key: video.key,
            site: video.site,
            type: video.type,
            id: video.id,
        })),
    };
}
