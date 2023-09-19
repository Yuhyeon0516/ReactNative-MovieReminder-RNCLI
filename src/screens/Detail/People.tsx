import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import OpenColor from 'open-color';

const styles = StyleSheet.create({
    container: {
        backgroundColor: OpenColor.white,
        borderRadius: 12,
        overflow: 'hidden',
        width: 150,
    },
    photo: {
        height: 150,
        backgroundColor: OpenColor.gray[3],
    },
    bottom: {
        padding: 12,
    },
    nameText: {
        color: OpenColor.black,
        fontSize: 16,
        fontWeight: 'bold',
    },
    descriptionText: {
        color: OpenColor.black,
        fontSize: 14,
    },
});

interface PeopleProps {
    name: string;
    description: string;
    photoUrl?: string;
}

export default function People({name, description, photoUrl}: PeopleProps) {
    return (
        <View style={styles.container}>
            <View style={styles.photo}>
                {photoUrl && (
                    <Image style={styles.photo} source={{uri: photoUrl}} />
                )}
            </View>

            <View style={styles.bottom}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.descriptionText}>{description}</Text>
            </View>
        </View>
    );
}
