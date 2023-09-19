import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootStackParamList} from './src/types';
import MoviesScreen from './src/screens/Movies/MoviesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Movies" component={MoviesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
