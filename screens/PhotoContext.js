import React, { useState, useEffect, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const storedPhotos = await AsyncStorage.getItem("photos");
            console.log('Loading photos from storage:', storedPhotos);
            if (storedPhotos) {
                const parsedPhotos = JSON.parse(storedPhotos);
                setPhotos(parsedPhotos);
            }
        } catch (e) {
            console.log("Error loading photos:", e);
        }
    };

    const savePhotos = async (newPhotos) => {
        try {
            await AsyncStorage.setItem("photos", JSON.stringify(newPhotos));
            console.log('Photos saved to storage:', newPhotos);
            setPhotos(newPhotos);
        } catch (e) {
            console.log("Error saving photos:", e);
        }
    };

    return (
        <PhotoContext.Provider value={{ photos, savePhotos }}>
            {children}
        </PhotoContext.Provider>
    );
};