import {useQuery} from '@tanstack/react-query';
import {useCallback} from 'react';
import {getMovieDetails} from '../../modules/ApiRequest';

interface UseDetailProp {
    id: number;
}

export default function useDetail({id}: UseDetailProp) {
    const getMovie = useCallback(() => getMovieDetails({id}), [id]);

    const {isLoading, data} = useQuery({
        queryKey: ['movie', id],
        queryFn: getMovie,
    });

    return {
        isLoading,
        movie: data,
    };
}
