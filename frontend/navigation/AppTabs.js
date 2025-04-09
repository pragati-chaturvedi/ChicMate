// navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WardrobeScreen from '../screens/WardrobeScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: '#aaa',
                tabBarStyle: {
                    backgroundColor: colors.white,
                    borderTopColor: colors.accent,
                    borderTopWidth: 1,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Wardrobe') {
                        iconName = 'shirt';
                    } else if (route.name === 'Recommendations') {
                        iconName = 'chatbubbles';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
            <Tab.Screen name="Recommendations" component={RecommendationScreen} />
        </Tab.Navigator>
    );
}
