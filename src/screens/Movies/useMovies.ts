import {useCallback} from 'react';
import {getDiscoverMovies} from '../../modules/ApiRequest';
import {useQuery} from '@tanstack/react-query';
import moment from 'moment';

export default function useMovies() {
    const getUpcommingMovies = useCallback(async () => {
        const result = await getDiscoverMovies({
            releaseDateGte: moment().format('YYYY-MM-DD'),
            releaseDateLte: moment().add(1, 'years').format('YYYY-MM-DD'),
        });

        return result;
    }, []);

    const {data, isLoading} = useQuery({
        queryKey: ['upcomming-movies'],
        queryFn: getUpcommingMovies,
    });

    const movies = data?.results ?? [];

    return {
        movies,
        isLoading,
    };
}
