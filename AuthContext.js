import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                setUserToken(token);
            } catch (e) {
                console.log('Error loading token:', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (token) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            setUserToken(token);
        } catch (e) {
            console.log('Error saving token:', e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setUserToken(null);
        } catch (e) {
            console.log('Error removing token:', e);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoading, userToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};