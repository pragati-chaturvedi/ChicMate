// screens/OnboardingScreen.js

// Can be used like an onvoarding screen after login to navigate to recommendation chat or wardrobe 


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { colors } from '../styles/globalStyles';

export default function OnboardingScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Header title="Welcome to ChicMate!" />
            <View style={styles.content}>
                <Text style={styles.text}>
                    Discover outfit recommendations, manage your wardrobe, and get personalized style tips!
                </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Main')}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
    content: { flex: 1, justifyContent: 'center', padding: 16 },
    text: { color: colors.textDark, fontSize: 18, textAlign: 'center' },
    button: { backgroundColor: colors.accent, margin: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});
