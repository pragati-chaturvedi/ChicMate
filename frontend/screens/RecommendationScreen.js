// screens/RecommendationScreen.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Keyboard,
    Animated,
} from 'react-native';
import Header from '../components/Header';
import ChatBubble from '../components/ChatBubble';
import { sendRecommendationRequest } from '../utils/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/globalStyles';
import { ChatContext } from '../contexts/ChatContext';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

// Helper function to remove triple backticks and parse JSON
const parseRecommendation = (rawRecommendation) => {
    const trimmed = rawRecommendation
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    try {
        return JSON.parse(trimmed);
    } catch (error) {
        console.error('Error parsing recommendation JSON:', error);
        return null;
    }
};

export default function RecommendationScreen() {
    const [message, setMessage] = useState('');
    const [location, setLocation] = useState('');
    const [uploadedItem, setUploadedItem] = useState('');
    const [recommendedItems, setRecommendedItems] = useState([]);
    const { chatHistory, addMessage } = useContext(ChatContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error("Location permission not granted");
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            // Reverse geocode to get city
            const [address] = await Location.reverseGeocodeAsync(loc.coords);
            console.log("LOCATION - ", address.city);
            setLocation(address.city || address.region || '');
        })();
    }, []);

    // Build a prompt that includes the last 3 messages as context
    const buildPromptWithContext = (newMessage) => {
        const contextMessages = chatHistory.slice(-3)
            .map((m) => `${m.sender}: ${m.text}`)
            .join('\n');
        return `${contextMessages}\nUser: ${newMessage}`;
    };

    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access gallery is required!");
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType, // Use the correct enum value
            allowsEditing: true,
            quality: 0.7,
            base64: true, // Include base64 data
        });
        console.log("Picker Result:", pickerResult);
        if (!pickerResult.cancelled) {
            const base64Data =
                pickerResult.assets && pickerResult.assets.length > 0
                    ? pickerResult.assets[0].base64
                    : pickerResult.base64;
            if (base64Data) {
                setUploadedItem(base64Data);
                console.log("Uploaded image (base64) received.");
                // Add the image as a chat message so the user can see the thumbnail immediately
                addMessage({ sender: 'user', uploadedItem: base64Data });
            } else {
                console.log("Base64 data not available");
            }
        }
    };

    const handleSend = async () => {
        if (message.trim() === '') return;
        // Save user's text message to context
        const userMessage = { sender: 'user', text: message };
        addMessage(userMessage);

        // Build context-aware prompt from chat history
        const contextAwarePrompt = buildPromptWithContext(message);
        console.log("Context:", contextAwarePrompt);
        console.log("Location:", location);
        console.log("Uploaded Item (base64):", uploadedItem);

        Keyboard.dismiss();
        setMessage('');

        // Send recommendation request with prompt, context, location, and uploaded image data
        const responseData = await sendRecommendationRequest(message, contextAwarePrompt, location, uploadedItem);
        console.log("Response after API call --> ", responseData);

        if (responseData.intent === 'outfit_recommendation') {
            const parsed = parseRecommendation(responseData.raw_recommendation);
            console.log("Parsed Recommendation:", parsed);
            if (parsed && parsed.recommendation) {
                const { recommended_outfit, recommended_items } = parsed.recommendation;
                const modelMessage = { sender: 'model', text: recommended_outfit };
                addMessage(modelMessage);
                setRecommendedItems(recommended_items);
            } else {
                addMessage({ sender: 'model', text: 'Sorry, there was a problem processing the recommendation.' });
            }
        } else {
            addMessage({
                sender: 'model',
                text: responseData.message || "I'm here to help you pick outfits!",
            });
        }
        setUploadedItem('');
    };

    const renderFooter = () => {
        if (recommendedItems.length === 0) return null;
        return (
            <View style={styles.imagesContainer}>
                <Text style={styles.sectionTitle}>Recommended Outfits</Text>
                <FlatList
                    data={recommendedItems}
                    horizontal
                    keyExtractor={(item) => item.item_id}
                    renderItem={({ item }) => (
                        <View style={styles.imageWrapper}>
                            <Animated.Image
                                source={{ uri: item.item_url }}
                                style={styles.imageStyle}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
                <Header title="Chat with ChicMate" />
                <LinearGradient
                    colors={[colors.background, '#FFFFFF']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                        <FlatList
                            data={chatHistory}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <ChatBubble message={item} />}
                            contentContainerStyle={styles.chatContainer}
                            ListFooterComponent={renderFooter}
                        />
                    </Animated.View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ask for outfit ideas..."
                            placeholderTextColor="#999"
                            value={message}
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
                            <Ionicons name="image" size={24} color={colors.accent} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                            <LinearGradient
                                colors={[colors.accent, '#4B9EA6']}
                                style={styles.sendButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="send" size={24} color={colors.white} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    gradient: { flex: 1 },
    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        padding: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: colors.white,
        borderTopColor: colors.accent,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        color: colors.textDark,
        backgroundColor: '#f3f7f7',
        borderRadius: 4,
        paddingHorizontal: 12,
    },
    imageButton: {
        marginLeft: 8,
        padding: 8,
    },
    sendButton: {
        marginLeft: 8,
        borderRadius: 4,
        justifyContent: 'center',
    },
    sendButtonGradient: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: colors.textDark,
    },
    imagesContainer: {
        marginVertical: 16,
    },
    imageWrapper: {
        marginRight: 12,
        alignItems: 'center',
    },
    imageStyle: {
        width: 120,
        height: 120,
        borderRadius: 8,
    },
});
