// components/Header.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { colors } from '../styles/globalStyles';
import { ChatContext } from '../contexts/ChatContext'

export default function Header({ title }) {
    const navigation = useNavigation();
    const { clearChatHistory } = useContext(ChatContext)

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            clearChatHistory();
                            navigation.replace("AuthScreen");
                        }
                        catch (error) {
                            Alert.alert("Logout Error", error.message);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.header}>
            <Image source={require('../assets/images/chicmate_logo.png')} style={styles.logo} />
            <Text style={styles.headerText}>{title}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={colors.textDark} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.accent,
        elevation: 4,
        shadowColor: colors.accent,
        shadowOpacity: 0.8,
        shadowRadius: 8,
    },
    logo: {

        width: 50,
        height: 50,
        resizeMode: 'cover',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textDark,
        letterSpacing: 1.2
    },
    logoutButton: {
        size: 30,
        padding: 8,
        shadowColor: colors.accent,
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
});
