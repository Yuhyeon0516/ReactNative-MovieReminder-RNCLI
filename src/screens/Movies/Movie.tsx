import {NavigationProp, useNavigation} from '@react-navigation/native';
import OpenColor from 'open-color';
import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../../types';

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: OpenColor.gray[6],
        padding: 12,
        flexDirection: 'row',
    },
    poster: {
        width: 100,
        height: 150,
        backgroundColor: OpenColor.gray[3],
    },
    posterImage: {
        width: 100,
        height: 150,
    },
    info: {
        marginLeft: 12,
        flex: 1,
    },
    titleText: {
        fontSize: 18,
        color: OpenColor.white,
        fontWeight: 'bold',
    },
    originalTitleText: {
        marginTop: 2,
        fontSize: 16,
        color: OpenColor.white,
    },
    releaseDateText: {
        marginTop: 2,
        fontSize: 14,
        color: OpenColor.white,
    },
    overviewText: {
        marginTop: 8,
        fontSize: 12,
        color: OpenColor.white,
    },
});

interface MovieProps {
    id: number;
    title: string;
    originalTitle: string;
    releaseDate: string;
    overview: string;
    posterUrl?: string;
}

export default function Movie({
    id,
    title,
    originalTitle,
    releaseDate,
    overview,
    posterUrl,
}: MovieProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const onPress = useCallback(() => {
        navigation.navigate('Detail', {id});
    }, [id, navigation]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.poster}>
                {posterUrl && (
                    <Image
                        style={styles.posterImage}
                        source={{uri: posterUrl}}
                    />
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.originalTitleText}>{originalTitle}</Text>
                <Text style={styles.releaseDateText}>{releaseDate}</Text>
                <Text style={styles.overviewText}>{overview}</Text>
            </View>
        </TouchableOpacity>
    );
}
