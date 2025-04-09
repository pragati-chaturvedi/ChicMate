// components/WardrobeItemCard.js

import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles';

export default function WardrobeItemCard({ item, onDelete }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Ionicons name="trash" size={20} color={colors.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 5,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    deleteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },
});
