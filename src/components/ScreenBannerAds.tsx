import {Platform} from 'react-native';
import React from 'react';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adsUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === 'ios'
    ? 'ca-app-pub-5956225840587687/1490158219'
    : 'ca-app-pub-5956225840587687/9842209381';

export default function ScreenBannerAds() {
    return (
        <BannerAd
            unitId={adsUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
    );
}
