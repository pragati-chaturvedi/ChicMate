import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";

export default function RecommendationScreen() {
    const [weather, setWeather] = useState("");
    const [occasion, setOccasion] = useState("");
    const router = useRouter();

    const handleRecommendation = () => {
        if (!weather || !occasion) {
            alert("Please select both weather and occasion.");
        } else {
            alert(`Getting recommendations for ${weather} weather and ${occasion} occasion!`);
        }
    };

    return (
        <View style={styles.container}>
            {/* Go Back Button */}
            <Button
                mode="outlined"
                onPress={() => router.push("/")}
                style={styles.goBackButton}
                icon="arrow-left"
            >
                Go Back
            </Button>

            {/* Recommendation Form */}
            <Text style={styles.title}>Get Recommendations</Text>
            <TextInput
                label="Weather"
                value={weather}
                onChangeText={setWeather}
                style={styles.input}
                placeholder="e.g., Sunny, Rainy"
            />
            <TextInput
                label="Occasion"
                value={occasion}
                onChangeText={setOccasion}
                style={styles.input}
                placeholder="e.g., Casual, Formal"
            />
            <Button mode="contained" onPress={handleRecommendation} style={styles.button}>
                Get Recommendations
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
        width: "80%",
    },
    goBackButton: {
        position: "absolute", // Absolute positioning
        top: 16, // Distance from the top of the screen
        left: 16, // Distance from the left side
        zIndex: 10, // Ensures the button is above other elements
    },
    button: {
        marginTop: 20,
        width: "80%",
    },
});
