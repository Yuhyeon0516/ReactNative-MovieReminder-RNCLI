import React, {useCallback, useEffect, useState} from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import useMovies from './useMovies';
import Movie from './Movie';
import OpenColor from 'open-color';
import Screen from '../../components/Screen';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import mobileAds from 'react-native-google-mobile-ads';

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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRightComponent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alarmButton: {},
    alarmIcon: {
        fontSize: 24,
        color: OpenColor.white,
    },
});

export default function MoviesScreen() {
    const {movies, isLoading, loadMore, canLoadMore, refresh} = useMovies();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [adsInitialized, setAdsInitialized] = useState(false);

    const renderRightComponent = useCallback(() => {
        return (
            <View style={styles.headerRightComponent}>
                <TouchableOpacity
                    style={styles.alarmButton}
                    onPress={() => {
                        navigation.navigate('Reminders');
                    }}>
                    <MaterialIcons
                        name="notifications"
                        style={styles.alarmIcon}
                    />
                </TouchableOpacity>
            </View>
        );
    }, [navigation]);

    useEffect(() => {
        (async () => {
            await mobileAds().initialize();
            setAdsInitialized(true);
        })();
    }, []);

    return (
        <Screen renderRightComponent={renderRightComponent}>
            {isLoading || !adsInitialized ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={OpenColor.white} />
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.movieList}
                    data={movies}
                    renderItem={({item: movie}) => (
                        <Movie
                            id={movie.id}
                            title={movie.title}
                            originalTitle={movie.originalTitle}
                            releaseDate={movie.releaseDate}
                            overview={movie.overview}
                            posterUrl={movie.posterUrl ?? undefined}
                        />
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={styles.separator} />
                    )}
                    onEndReached={() => {
                        if (canLoadMore) {
                            loadMore();
                        }
                    }}
                    onEndReachedThreshold={0.7}
                    refreshControl={
                        <RefreshControl
                            onRefresh={refresh}
                            refreshing={isLoading}
                            tintColor={OpenColor.white}
                        />
                    }
                />
            )}
        </Screen>
    );
}
