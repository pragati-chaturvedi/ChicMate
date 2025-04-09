// styles/globalStyles.js
import { StyleSheet } from 'react-native';

export const colors = {
    background: '#E0F0F0',  // pastel teal
    accent: '#4B9EA6',      // teal accent
    textDark: '#223843',    // deeper teal for text
    white: '#FFFFFF',
};

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    text: {
        color: colors.textDark,
    },
});
