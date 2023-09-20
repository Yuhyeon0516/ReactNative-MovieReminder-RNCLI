import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import Screen from '../../components/Screen';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import useDetail from './useDetail';
import OpenColor from 'open-color';
import Section from './Section';
import People from './People';
import YouTubeVideo from './YouTubeVideo';
import CalendarModule from '../../modules/CalendarModule';
import moment from 'moment';
import useReminder from '../../hook/useReminder';
import RewardAds, {RewardAdsRef} from '../../components/RewardAds';

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 20,
    },
    titleSection: {
        flexDirection: 'row',
    },
    poster: {
        width: 100,
        height: 150,
        backgroundColor: OpenColor.gray[3],
    },
    infoTexts: {
        flex: 1,
        marginLeft: 20,
    },
    titleTexts: {
        flex: 1,
    },
    titleText: {
        fontSize: 30,
        color: OpenColor.white,
        fontWeight: 'bold',
    },
    originalTitleText: {
        marginTop: 2,
        fontSize: 14,
        color: OpenColor.white,
    },
    releaseDateText: {
        marginTop: 4,
        fontSize: 16,
        color: OpenColor.white,
    },
    overviewText: {
        fontSize: 14,
        color: OpenColor.white,
    },
    separator: {
        width: 16,
    },
    verticalSeparator: {
        height: 16,
    },
    addToCalendarButton: {
        marginTop: 8,
        backgroundColor: OpenColor.white,
        borderRadius: 8,
        alignItems: 'center',
        padding: 12,
    },
    addToCalendarButtonText: {
        color: OpenColor.black,
    },
});

export default function DetailScreen() {
    const {
        params: {id},
    } = useRoute<RouteProp<RootStackParamList, 'Detail'>>();

    const {movie, isLoading} = useDetail({id});
    const {addReminder, hasReminder, removeReminder, canAddReminder} =
        useReminder();
    const rewardAdsRef = useRef<RewardAdsRef>(null);

    const renderMovie = useCallback(() => {
        if (!movie) {
            return null;
        }

        const director = movie.crews.find(crew => crew.job === 'Director');
        const youTubeVideos = movie.videos.filter(
            video => video.site === 'YouTube',
        );

        return (
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.titleSection}>
                    <View style={styles.poster}>
                        {movie.posterUrl && (
                            <Image
                                style={styles.poster}
                                source={{uri: movie.posterUrl}}
                            />
                        )}
                    </View>

                    <View style={styles.infoTexts}>
                        <View style={styles.titleTexts}>
                            <Text style={styles.titleText}>{movie.title}</Text>
                            <Text style={styles.originalTitleText}>
                                {movie.originalTitle}
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.releaseDateText
                            }>{`개봉일: ${movie.releaseDate}`}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.addToCalendarButton}
                    onPress={async () => {
                        try {
                            await CalendarModule.createCalendarEvent(
                                moment(movie.releaseDate).valueOf() / 1000,
                                movie.title,
                            );

                            Alert.alert('캘린더 등록이 완료되었습니다.');
                        } catch (error: any) {
                            Alert.alert(error.message);
                        }
                    }}>
                    <Text style={styles.addToCalendarButtonText}>
                        캘린더에 추가
                    </Text>
                </TouchableOpacity>
                {hasReminder(`${movie.id}`) ? (
                    <TouchableOpacity
                        style={styles.addToCalendarButton}
                        onPress={async () => {
                            try {
                                await removeReminder(`${movie.id}`);

                                Alert.alert('알림 제거가 완료되었습니다.');
                            } catch (error: any) {
                                Alert.alert(error.message);
                            }
                        }}>
                        <Text style={styles.addToCalendarButtonText}>
                            알림 제거하기
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.addToCalendarButton}
                        onPress={async () => {
                            async function addReminderHandler() {
                                if (movie != null) {
                                    try {
                                        await addReminder(
                                            movie.id,
                                            movie.releaseDate,
                                            movie.title,
                                        );

                                        Alert.alert(
                                            '알림 등록이 완료되었습니다.',
                                        );
                                    } catch (error: any) {
                                        Alert.alert(error.message);
                                    }
                                }
                            }
                            if (await canAddReminder()) {
                                addReminderHandler();
                            } else {
                                Alert.alert(
                                    '광고를 보고 리마인더를 등록하시겠습니까?',
                                    undefined,
                                    [
                                        {
                                            text: '아니오',
                                        },
                                        {
                                            text: '네',
                                            onPress: () => {
                                                rewardAdsRef.current?.show({
                                                    onRewarded: rewarded => {
                                                        if (rewarded) {
                                                            addReminderHandler();
                                                        }
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                );
                            }
                        }}>
                        <Text style={styles.addToCalendarButtonText}>
                            알림 추가하기
                        </Text>
                    </TouchableOpacity>
                )}

                <Section title="소개">
                    <Text style={styles.overviewText}>{movie.overview}</Text>
                </Section>

                {director && (
                    <Section title="감독">
                        <People
                            name={director.name}
                            description={director.job}
                            photoUrl={director.profileUrl ?? undefined}
                        />
                    </Section>
                )}

                <Section title="배우">
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={movie.casts}
                        renderItem={({item: cast}) => (
                            <People
                                name={cast.name}
                                description={cast.character}
                                photoUrl={cast.profileUrl ?? undefined}
                            />
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={styles.separator} />
                        )}
                    />
                </Section>

                {youTubeVideos.length > 0 && (
                    <Section title="관련 영상">
                        {youTubeVideos.map((video, index) => {
                            return (
                                <React.Fragment key={video.id}>
                                    <YouTubeVideo
                                        title={video.name}
                                        youTubeKey={video.key}
                                    />
                                    {index + 1 < youTubeVideos.length && (
                                        <View
                                            style={styles.verticalSeparator}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Section>
                )}
            </ScrollView>
        );
    }, [addReminder, canAddReminder, hasReminder, movie, removeReminder]);

    return (
        <Screen>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={OpenColor.white} />
                </View>
            ) : (
                renderMovie()
            )}
            <RewardAds ref={rewardAdsRef} />
        </Screen>
    );
}
