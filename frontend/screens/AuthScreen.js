import React, { useState, useEffect, useRef } from 'react';
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
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Animated } from 'react-native';
import { colors } from '../styles/globalStyles';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    console.log(email);
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    // Animated values for decorative bubbles
    const scaleAnimTop = useRef(new Animated.Value(1)).current;
    const scaleAnimBottom = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Looping animation for top left bubble
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnimTop, {
                    toValue: 1.1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnimTop, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Looping animation for bottom right bubble
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnimBottom, {
                    toValue: 1.1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnimBottom, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scaleAnimTop, scaleAnimBottom]);

    const handleSignUp = async () => {
        try {
            navigation.navigate("SignUp");
        } catch (error) {
            Alert.alert('Sign Up Error', error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("Main");
        } catch (error) {
            Alert.alert('Sign In Error', error.message);
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
                    {/* Animated decorative bubbles */}
                    <Animated.View style={[styles.shapeTopLeft, { transform: [{ scale: scaleAnimTop }] }]} />
                    <Animated.View style={[styles.shapeBottomRight, { transform: [{ scale: scaleAnimBottom }] }]} />

                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../assets/images/chicmate_logo.png')}
                                style={styles.logo}
                            />
                            <Text style={styles.title}>Welcome to ChicMate</Text>
                        </View>

                        <BlurView intensity={50} tint="light" style={styles.blurWrapper}>
                            <View style={styles.formContainer}>
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

                                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                                    <Text style={styles.buttonText}>Sign In</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
                                    <Text style={styles.buttonText}>Sign Up</Text>
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
    signUpButton: {
        backgroundColor: '#4B9EA6',
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Animated decorative shapes
    shapeTopLeft: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(75,158,166,0.2)', // Use a variant of your accent
    },
    shapeBottomRight: {
        position: 'absolute',
        bottom: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(75,158,166,0.2)',
    },
});
