import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import OpenColor from 'open-color';

const styles = StyleSheet.create({
    section: {
        alignItems: 'flex-start',
    },
    sectionTitleText: {
        fontSize: 20,
        color: OpenColor.white,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 8,
    },
});

interface SectionProps {
    title: string;
    children?: React.ReactNode;
}

export default function Section({title, children}: SectionProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitleText}>{title}</Text>
            {children}
        </View>
    );
}
