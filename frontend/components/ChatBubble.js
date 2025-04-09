// ChatBubble.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors } from '../styles/globalStyles';

export default function ChatBubble({ message }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const isUser = message.sender === 'user';

    return (
        <Animated.View style={[styles.bubble, isUser ? styles.userBubble : styles.modelBubble, { opacity: fadeAnim }]}>
            {message.text ? (
                <Markdown style={markdownStyles}>{message.text}</Markdown>
            ) : null}
            {message.uploadedItem ? (
                <Image
                    source={{ uri: `data:image/*;base64,${message.uploadedItem}` }}
                    style={styles.image}
                />
            ) : null}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    bubble: {
        marginVertical: 4,
        marginHorizontal: 8,
        padding: 12,
        borderRadius: 16,
        maxWidth: '80%',
    },
    userBubble: {
        backgroundColor: colors.accent,
        alignSelf: 'flex-end',
    },
    modelBubble: {
        backgroundColor: '#f8fbfb',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: colors.accent,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 8,
        borderRadius: 8,
    },
});

const markdownStyles = {
    body: {
        color: colors.textDark,
        fontSize: 15,
        lineHeight: 20,
    },
    bullet_list: {
        marginLeft: 8,
    },
    list_item: {
        flexDirection: 'row',
    },
    strong: {
        fontWeight: '700',
    },
};
