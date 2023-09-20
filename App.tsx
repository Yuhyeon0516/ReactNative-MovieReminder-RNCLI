import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootStackParamList} from './src/types';
import MoviesScreen from './src/screens/Movies/MoviesScreen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import DetailScreen from './src/screens/Detail/DetailScreen';
import RemindersScreen from './src/screens/Reminders/RemindersScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

function App(): JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Movies" component={MoviesScreen} />
                    <Stack.Screen name="Detail" component={DetailScreen} />
                    <Stack.Screen
                        name="Reminders"
                        component={RemindersScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    );
}

export default App;
