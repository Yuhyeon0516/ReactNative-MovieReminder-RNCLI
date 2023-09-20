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

const MAX_REMINDER_NUM_FOR_FREE = 2;

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

    const loadReminders = useCallback(async () => {
        const notifications = await notifee.getTriggerNotifications();
        setReminders(notifications);
    }, []);

    useEffect(() => {
        loadReminders();
    }, [loadReminders]);

    const canAddReminder = useCallback(async () => {
        const triggerNotifications = await notifee.getTriggerNotifications();

        return triggerNotifications.length < MAX_REMINDER_NUM_FOR_FREE;
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

            await loadReminders();
        },
        [channelId, loadReminders],
    );

    const removeReminder = useCallback(
        async (id: string) => {
            await notifee.cancelTriggerNotification(id);
            loadReminders();
        },
        [loadReminders],
    );

    const hasReminder = useCallback(
        (id: string) => {
            const reminder = reminders.find(r => r.notification.id === id);
            return reminder;
        },
        [reminders],
    );

    return {
        addReminder,
        reminders,
        removeReminder,
        hasReminder,
        canAddReminder,
    };
}
