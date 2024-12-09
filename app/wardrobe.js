import React, { useState } from "react";
import { View, StyleSheet, FlatList, Image, Alert } from "react-native";
import { Button, Text, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function WardrobeScreen() {
    const [wardrobe, setWardrobe] = useState([]);
    const router = useRouter();

    const addClothingItem = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setWardrobe((prevWardrobe) => [
                ...prevWardrobe,
                { id: Date.now().toString(), uri: result.assets[0].uri },
            ]);
        }
    };

    const deleteClothingItem = (id) => {
        Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => setWardrobe((prevWardrobe) => prevWardrobe.filter((item) => item.id !== id)) },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Wardrobe</Text>
            <Button
                mode="outlined"
                onPress={() => router.push("/")}
                style={styles.goBackButton}
            >
                Go Back to Home
            </Button>
            <Button mode="contained" onPress={addClothingItem} style={styles.button}>
                Add Clothing Item
            </Button>
            <FlatList
                data={wardrobe}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        <IconButton
                            icon="delete"
                            size={24}
                            onPress={() => deleteClothingItem(item.id)}
                        />
                    </View>
                )}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#ffffff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    goBackButton: {
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    button: {
        marginVertical: 10,
    },
    list: {
        marginTop: 16,
    },
    itemContainer: {
        flex: 1,
        alignItems: "center",
        margin: 8,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
});
