// utils/api.js;
import { auth } from '../firebase';



export const getWardrobeItems = async () => {
    try {
        const user = auth.currentUser;
        if (!user) return [];
        const response = await fetch(`${backend_url}/api/v1/wardrobe/items?userId=${user.uid}`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching wardrobe items:', error);
        return [];
    }
};

export const uploadWardrobeItem = async (localUri, fileName, fileType) => {
    console.log('Upload Function called');
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        // Create FormData for file upload
        let formData = new FormData();
        formData.append('file', {
            uri: localUri,
            name: fileName,
            type: fileType,
        });
        formData.append('userId', user.uid);

        const response = await fetch(`${backend_url}/api/v1/wardrobe/upload-image?userId=${user.uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error uploading wardrobe item:', error);
        throw error;
    }
};

export const deleteWardrobeItem = async (itemId) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        await fetch(`${backend_url}/api/v1/wardrobe/delete?item_id=${itemId}&userId=${user.uid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting wardrobe item:', error);
    }
};

export const sendRecommendationRequest = async (prompt, contextAwarePrompt, location, Image) => {
    try {
        const user = auth.currentUser;
        const payload = {
            details: prompt,
            history: contextAwarePrompt,
            location: location,
            uploaded_item: Image,
        };
        const response = await fetch(`${backend_url}/api/v1/recommendation?userId=${user.uid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log("DATA RECIEVED AFTER API CALL - ", data);
        return data;
    } catch (error) {
        console.error('Error sending recommendation request:', error);
        return 'Error occurred while fetching recommendation.';
    }
};


