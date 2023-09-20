import {useCallback, useEffect, useState} from 'react';
import notifee, {
    AndroidImportance,
    AndroidNotificationSetting,
    AuthorizationStatus,
    TimestampTrigger,
    TriggerNotification,
    TriggerType,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import moment from 'moment';

export default function useReminder() {
    const [channelId, setChannelId] = useState<string | null>(null);
    const [reminders, setReminders] = useState<TriggerNotification[]>([]);

    useEffect(() => {
        (async () => {
            if (Platform.OS === 'android') {
                const id = await notifee.createChannel({
                    id: 'default',
                    name: 'Default Channel',
                    importance: AndroidImportance.HIGH,
                });

                setChannelId(id);
            } else {
                setChannelId('ios-fake-channel-id');
            }
        })();
    }, []);

    const addReminder = useCallback(
        async (movieId: number, releaseDate: string, title: string) => {
            const settings = await notifee.requestPermission();

            if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
                throw new Error('Permission denied');
            }

            if (Platform.OS === 'android') {
                if (
                    settings.android.alarm !==
                    AndroidNotificationSetting.ENABLED
                ) {
                    throw new Error(
                        'Please allow setting alarms and reminder on settings',
                    );
                }
            }

            if (!channelId) {
                throw new Error('Channel is not created');
            }

            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: moment(releaseDate).valueOf(),
                // timestamp: moment().add(5, 'seconds').valueOf(),
            };

            await notifee.createTriggerNotification(
                {
                    id: `${movieId}`,
                    title: '영화 개봉일 알림',
                    body: title,
                    android: {
                        channelId: channelId,
                    },
                },
                trigger,
            );
        },
        [channelId],
    );

    const loadReminders = useCallback(async () => {
        return await notifee.getTriggerNotifications();
    }, []);

    useEffect(() => {
        (async () => {
            const notifications = await loadReminders();
            setReminders(notifications);
        })();
    }, [loadReminders]);

    return {
        addReminder,
        reminders,
    };
}
