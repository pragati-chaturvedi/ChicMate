// screens/WardrobeScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Animated,
    Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import WardrobeItemCard from '../components/WardrobeItemCard';
import { getWardrobeItems, deleteWardrobeItem, uploadWardrobeItem } from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/globalStyles';

export default function WardrobeScreen() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Animated value for FAB rotation and options opacity
    const rotationAnim = useRef(new Animated.Value(0)).current;
    const optionsOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        const data = await getWardrobeItems();
        setItems(data);
        setLoading(false);
    };

    const handleDelete = async (itemId) => {
        await deleteWardrobeItem(itemId);
        fetchItems();
    };

    // Common function to upload image
    const uploadImage = async (localUri) => {
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let fileType = match ? `image/${match[1]}` : `image`;
        try {
            await uploadWardrobeItem(localUri, filename, fileType);
            Alert.alert("Upload Successful", "Your item has been uploaded.");
            fetchItems();
        } catch (error) {
            Alert.alert("Upload Error", "Unable to upload image.");
        }
    };

    // Handler for uploading via camera.
    const handleCameraUpload = async () => {
        setShowUploadOptions(false);
        Animated.timing(optionsOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission required", "Permission to access camera is required!");
            return;
        }
        const pickerResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: true,
            quality: 0.7,
        });
        if (pickerResult.cancelled) return;
        const localUri = pickerResult.assets ? pickerResult.assets[0].uri : pickerResult.uri;
        await uploadImage(localUri);
    };

    // Handler for uploading via gallery.
    const handleGalleryUpload = async () => {
        setShowUploadOptions(false);
        Animated.timing(optionsOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission required", "Permission to access gallery is required!");
            return;
        }
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: true,
            quality: 0.7,
        });
        if (pickerResult.cancelled) return;
        const localUri = pickerResult.assets ? pickerResult.assets[0].uri : pickerResult.uri;
        await uploadImage(localUri);
    };

    // Toggle FAB and upload options animation
    const toggleUploadOptions = () => {
        const toValue = showUploadOptions ? 0 : 1;
        setShowUploadOptions(!showUploadOptions);
        Animated.timing(rotationAnim, {
            toValue: toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
        Animated.timing(optionsOpacity, {
            toValue: toValue,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    // Group items by category using description metadata (fallback to Other)
    const groupedItems = items.reduce((groups, item) => {
        let category = "Other";
        try {
            let descriptionStr = item.description;
            descriptionStr = descriptionStr.replace(/```json/g, '').replace(/```/g, '').trim();
            const desc = JSON.parse(descriptionStr);
            category = desc.item_type || desc.type || "Other";
        } catch (e) {
            console.error("Error parsing item description:", e);
        }
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});
    const customOrder = ["TOP", "BOTTOM", "DRESS", "SWEATER", "JACKET", "ACCESSORY", "FOOTWEAR", "OTHER"];
    const categories = Object.keys(groupedItems).sort((a, b) => {
        const indexA = customOrder.indexOf(a.toUpperCase());
        const indexB = customOrder.indexOf(b.toUpperCase());
        // If a category isn't found in customOrder, push it to the end
        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <LinearGradient
                colors={[colors.background, '#FFFFFF']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.container}>
                    <Header title="My Wardrobe" />
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.accent} />
                    ) : (
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            {selectedCategory === null ? (
                                // Show categories as vertical buttons
                                <View style={styles.categoriesContainer}>
                                    {categories.length === 0 ? (
                                        <Text style={styles.emptyText}>Wardrobe empty. Upload items to get started!</Text>
                                    ) : (
                                        categories.map((cat) => (
                                            <TouchableOpacity
                                                key={cat}
                                                style={styles.categoryButton}
                                                onPress={() => setSelectedCategory(cat)}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.categoryButtonText}>{cat.toUpperCase()}</Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                            ) : (
                                // Show items for the selected category, with a back button in the header
                                <View style={styles.categorySection}>
                                    <View style={styles.categoryHeader}>
                                        <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                                            <Ionicons name="arrow-back" size={24} color={colors.accent} />
                                        </TouchableOpacity>
                                        <Text style={styles.sectionHeader}>{selectedCategory.toUpperCase()}</Text>
                                    </View>
                                    <FlatList
                                        data={groupedItems[selectedCategory]}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <WardrobeItemCard item={item} onDelete={() => handleDelete(item.id)} />
                                        )}
                                        numColumns={2}
                                        key={`columns-2`}
                                        scrollEnabled={false}
                                    />
                                </View>
                            )}
                        </ScrollView>
                    )}
                    {/* Animated upload options */}
                    <Animated.View style={[styles.uploadOptionsContainer, { opacity: optionsOpacity }]}>
                        <TouchableOpacity style={styles.uploadOptionButton} onPress={handleCameraUpload}>
                            <Ionicons name="camera" size={28} color={colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.uploadOptionButton} onPress={handleGalleryUpload}>
                            <Ionicons name="image" size={28} color={colors.white} />
                        </TouchableOpacity>
                    </Animated.View>
                    {/* Animated Floating Action Button */}
                    <TouchableOpacity onPress={toggleUploadOptions} activeOpacity={0.8}>
                        <Animated.View style={[styles.fab, {
                            transform: [{
                                rotate: rotationAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '90deg'],
                                }),
                            }],
                        }]}>
                            <Ionicons name="add" size={32} color={colors.white} />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        paddingBottom: 80,
        paddingHorizontal: 10,
    },
    // Vertical categories list styling
    categoriesContainer: {
        marginVertical: 20,
    },
    categoryButton: {
        backgroundColor: '#ffffffaa',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 2,
        // Simple shadow for depth
        shadowColor: colors.accent,
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    categoryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textDark,
        textAlign: 'center',
    },
    categorySection: {
        marginVertical: 10,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        color: colors.textDark,
    },
    emptyText: {
        color: colors.textDark,
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontStyle: 'italic',
    },
    // Floating Action Button
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: colors.accent,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: colors.accent,
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    // Upload options container
    uploadOptionsContainer: {
        position: 'absolute',
        bottom: 80,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 120,
    },
    uploadOptionButton: {
        backgroundColor: colors.accent,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        elevation: 4,
        shadowColor: colors.accent,
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
});
