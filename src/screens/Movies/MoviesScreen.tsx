import React from 'react';
import {View, Text} from 'react-native';
import useMovies from './useMovies';

export default function MoviesScreen() {
    const {movies} = useMovies();

    return (
        <View>
            <Text>MoviesScreen</Text>
        </View>
    );
}
