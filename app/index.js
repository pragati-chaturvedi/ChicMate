import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to ChicMate</Text>
            <Button
                mode="contained"
                style={styles.button}
                onPress={() => router.push("/wardrobe")}
            >
                Manage Wardrobe
            </Button>
            <Button
                mode="contained"
                style={styles.button}
                onPress={() => router.push("/recommendation")}
            >
                Get Recommendations
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    button: {
        marginVertical: 10,
        width: "80%",
    },
});
