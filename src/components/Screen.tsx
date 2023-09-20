import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from 'open-color';
import ScreenBannerAds from './ScreenBannerAds';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    header: {
        height: 48,
        flexDirection: 'row',
    },
    left: {
        flex: 1,
        justifyContent: 'center',
    },
    center: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    right: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    },
    content: {
        flex: 1,
    },
    backIcon: {
        fontSize: 20,
        color: Colors.white,
        marginLeft: 20,
    },
});

interface ScreenProps {
    children?: React.ReactNode;
    title?: string;
    headerVisible?: boolean;
    renderRightComponent?: () => JSX.Element;
}

const Screen = ({
    children,
    title,
    headerVisible = true,
    renderRightComponent,
}: ScreenProps) => {
    const navigation = useNavigation();
    const onPressBackButton = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={'light-content'} />
            {headerVisible && (
                <View style={styles.header}>
                    <View style={styles.left}>
                        {navigation.canGoBack() && (
                            <TouchableOpacity onPress={onPressBackButton}>
                                <Icon
                                    style={styles.backIcon}
                                    name="arrow-back"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.headerTitle}>{title}</Text>
                    </View>
                    <View style={styles.right}>
                        {renderRightComponent != null && renderRightComponent()}
                    </View>
                </View>
            )}
            <View style={styles.content}>{children}</View>
            <ScreenBannerAds />
        </SafeAreaView>
    );
};

export default Screen;
