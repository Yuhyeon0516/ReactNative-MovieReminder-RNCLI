import {
    Platform,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {
    AdEventType,
    RewardedAdEventType,
    RewardedInterstitialAd,
    TestIds,
} from 'react-native-google-mobile-ads';
import OpenColor from 'open-color';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        backgroundColor: OpenColor.black,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const adsUnitId = __DEV__
    ? TestIds.REWARDED_INTERSTITIAL
    : Platform.OS === 'ios'
    ? 'ca-app-pub-5956225840587687/1116158664'
    : 'ca-app-pub-5956225840587687/2987072713';

interface RewardAdsShowParam {
    onRewarded: (rewarded: boolean) => void;
}

export interface RewardAdsRef {
    show: (param: RewardAdsShowParam) => void;
}

const RewardAds = React.forwardRef<RewardAdsRef>((props, ref) => {
    const [loaded, setLoaded] = useState(false);
    const rewardAdsRef = useRef(
        RewardedInterstitialAd.createForAdRequest(adsUnitId),
    );
    const onRewardedRef = useRef<RewardAdsShowParam['onRewarded']>();
    const [visible, setVisible] = useState(false);
    const rewardedRef = useRef(false);

    useEffect(() => {
        const unsubscribeLoaded = rewardAdsRef.current.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                setLoaded(true);
            },
        );

        const unsubscribeEarned = rewardAdsRef.current.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            () => {
                rewardedRef.current = true;
            },
        );

        const unsubscribeClosed = rewardAdsRef.current.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                if (onRewardedRef.current != null) {
                    onRewardedRef.current(rewardedRef.current);
                }

                rewardedRef.current = false;
                setVisible(false);
                setLoaded(false);
            },
        );

        if (!loaded) {
            rewardAdsRef.current.load();
        }

        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeClosed();
        };
    }, [loaded]);

    useEffect(() => {
        if (visible && loaded) {
            rewardAdsRef.current.show();
        }
    }, [loaded, visible]);

    useImperativeHandle(
        ref,
        () => ({
            show: ({onRewarded}) => {
                onRewardedRef.current = onRewarded;
                setVisible(true);
            },
        }),
        [],
    );

    if (visible && !loaded) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator />
            </SafeAreaView>
        );
    }

    return null;
});

export default RewardAds;
