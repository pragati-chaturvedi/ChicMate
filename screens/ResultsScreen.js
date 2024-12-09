import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function ResultsScreen({ route }) {
    const { image } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommended Outfits</Text>
            <Image source={{ uri: image }} style={styles.image} />
            <Text>*Results will appear here after model integration*</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});
