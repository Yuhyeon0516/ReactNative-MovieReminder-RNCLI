import React from 'react';
import {
    SafeAreaView,
    FlatList,
    StyleSheet,
    View,
    StatusBar,
} from 'react-native';
import useMovies from './useMovies';
import Movie from './Movie';
import OpenColor from 'open-color';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: OpenColor.black,
    },
    movieList: {
        padding: 20,
    },
    separator: {
        height: 16,
    },
});

export default function MoviesScreen() {
    const {movies} = useMovies();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} />
            <FlatList
                contentContainerStyle={styles.movieList}
                data={movies}
                renderItem={({item: movie}) => (
                    <Movie
                        title={movie.title}
                        originalTitle={movie.originalTitle}
                        releaseDate={movie.releaseDate}
                        overview={movie.overview}
                        posterUrl={movie.posterUrl ?? undefined}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}
