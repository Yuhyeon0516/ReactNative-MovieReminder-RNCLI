import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import useReminder from '../../hook/useReminder';
import Screen from '../../components/Screen';
import OpenColor from 'open-color';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    reminderList: {
        padding: 20,
    },
    reminderItem: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        borderColor: OpenColor.gray[6],
        flexDirection: 'row',
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
    textContainer: {
        flex: 1,
    },
    removeReminderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeReminderIcon: {
        color: OpenColor.white,
        fontSize: 24,
    },
});

export default function RemindersScreen() {
    const {reminders, removeReminder} = useReminder();

    return (
        <Screen>
            <FlatList
                contentContainerStyle={styles.reminderList}
                data={reminders}
                renderItem={({item: reminder}) => {
                    return (
                        <View style={styles.reminderItem}>
                            <View style={styles.textContainer}>
                                <Text style={styles.titleText}>
                                    {reminder.notification.body}
                                </Text>
                                {'timestamp' in reminder.trigger && (
                                    <Text style={styles.timestampText}>
                                        {moment(
                                            reminder.trigger.timestamp,
                                        ).format('LLL')}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.removeReminderContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (reminder.notification.id) {
                                            removeReminder(
                                                reminder.notification.id,
                                            );
                                        }
                                    }}>
                                    <MaterialIcons
                                        name="notifications-off"
                                        style={styles.removeReminderIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </Screen>
    );
}
