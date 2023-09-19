import OpenColor from 'open-color';
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

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
    title: string;
    originalTitle: string;
    releaseDate: string;
    overview: string;
    posterUrl?: string;
}

export default function Movie({
    title,
    originalTitle,
    releaseDate,
    overview,
    posterUrl,
}: MovieProps) {
    return (
        <View style={styles.container}>
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
        </View>
    );
}
