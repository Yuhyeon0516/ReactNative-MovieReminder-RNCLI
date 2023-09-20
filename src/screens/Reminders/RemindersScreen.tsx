import {View, Text, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import useReminder from '../../hook/useReminder';
import Screen from '../../components/Screen';
import OpenColor from 'open-color';
import moment from 'moment';

const styles = StyleSheet.create({
    reminderList: {
        padding: 20,
    },
    reminderItem: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        borderColor: OpenColor.gray[6],
    },
    titleText: {
        fontSize: 18,
        color: OpenColor.white,
        fontWeight: 'bold',
    },
    bodyText: {
        marginTop: 2,
        fontSize: 14,
        color: OpenColor.white,
    },
    timestampText: {
        marginTop: 2,
        fontSize: 14,
        color: OpenColor.white,
    },
    separator: {
        height: 12,
    },
});

export default function RemindersScreen() {
    const {reminders} = useReminder();

    return (
        <Screen>
            <FlatList
                contentContainerStyle={styles.reminderList}
                data={reminders}
                renderItem={({item: reminder}) => {
                    return (
                        <View style={styles.reminderItem}>
                            <Text style={styles.titleText}>
                                {reminder.notification.body}
                            </Text>
                            {'timestamp' in reminder.trigger && (
                                <Text style={styles.timestampText}>
                                    {moment(reminder.trigger.timestamp).format(
                                        'LLL',
                                    )}
                                </Text>
                            )}
                        </View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </Screen>
    );
}
