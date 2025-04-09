// screens/SignUpScreen.js
import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors } from '../styles/globalStyles';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleCreateAccount = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Optionally update the user's profile with the display name
            await updateProfile(userCredential.user, { displayName: name });
            Alert.alert('Account Created', 'Your account has been created successfully.');
            navigation.replace('AppTabs');
        } catch (error) {
            Alert.alert('Sign Up Error', error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <LinearGradient
                    colors={[colors.background, '#FFFFFF']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../assets/images/chicmate_logo.png')}
                                style={styles.logo}
                            />
                            <Text style={styles.title}>Create Account</Text>
                        </View>

                        <BlurView intensity={50} tint="light" style={styles.blurWrapper}>
                            <View style={styles.formContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    placeholderTextColor="#aaa"
                                    value={name}
                                    onChangeText={setName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#aaa"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#aaa"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />

                                <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                                    <Text style={styles.buttonText}>Create Account</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
                                    <Text style={styles.buttonText}>Back to Login</Text>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    </ScrollView>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textDark,
        letterSpacing: 1.2,
    },
    blurWrapper: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    formContainer: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        padding: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginVertical: 10,
        fontSize: 16,
        color: colors.textDark,
        elevation: 2,
    },
    button: {
        backgroundColor: colors.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 12,
        elevation: 3,
    },
    backButton: {
        backgroundColor: colors.secondary || '#555',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
