import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithJwt } from "./fetchWithJwt";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "./useLanguage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true); // 新增加载状态
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, search } = location;
    const { setLanguage } = useLanguage();

    const login = async (email, hashedPassword) => {
        try {
            const url = "/api/v1/user/check_password";
            const postData = {
                user_email: email,
                hashed_password: hashedPassword,
            };
            const loginResponse = await fetchWithJwt(url, "POST", postData);
            const loginData = await loginResponse.json();

            if (loginData.valid) {
                sessionStorage.setItem("jwtToken", loginData.jwt_token);
                setIsLoggedIn(true);
            } else {
                return { success: false, error: loginData.message, preference: false };
            }

            return await loadUserInfo(loginData.preference);
            
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message, preference: false };
        }
    };

    const handleGoogleLoginCallback = async () => {
        const searchParams = new URLSearchParams(search);
        const errorMessage = searchParams.get('error');
        const jwt_token = searchParams.get('jwt_token');
        const preference = searchParams.get('preference') === 'True';

        
        console.log("handleGoogleLoginCallback", { errorMessage, jwt_token, preference });

        if (errorMessage) {
            return { success: false, error: errorMessage, preference: false };
        }

        if (jwt_token) {
            // 保存 JWT Token 到本地存储
            sessionStorage.setItem("jwtToken", jwt_token);
            setIsLoggedIn(true);
            
        } else {
            return { success: false, error: 'JWT token is missing in URL', preference: false };
        }
        return await loadUserInfo(preference);
    };

    const loadUserInfo = async(preference) => {
        try {
            const response = await fetchWithJwt(`/api/v1/user/get_info`, 'GET');
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const infoData = await response.json();
            console.log("user info:", infoData);
            setUserInfo(infoData);
            setLanguage(infoData["language"]);
            localStorage.setItem("language", infoData["language"]);

            sessionStorage.setItem("avatar", infoData["avatar"]);

            const tripResponse = await fetchWithJwt("/api/v1/trip", "GET");
            const tripData = await tripResponse.json();

            if (tripResponse.ok) {
                const userData = { user_name: infoData['user_name'], trips: tripData.user_trip };
                setUser(userData);
                sessionStorage.setItem("user", JSON.stringify(userData)); // Optional: Store user data in sessionStorage
                console.log(userData);
                return { success: true, error: null, preference: preference };
            } else {
                return { success: false, error: "Failed to fetch trips", preference: preference };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message, preference: preference };
        } finally {
            setIsLoading(false); // 取消加载状态
        }
    };

    const logout = () => {
        sessionStorage.removeItem("jwtToken");
        sessionStorage.removeItem("user"); // Remove user data from sessionStorage
        sessionStorage.removeItem("avatar"); // Remove user data from sessionStorage
        setUser({});
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const jwt_token = sessionStorage.getItem("jwtToken");
        const userData = sessionStorage.getItem("user");

        if (jwt_token && userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
            setIsLoading(false); // 取消加载状态
        } else if (pathname.includes("login")) {
            handleGoogleLoginCallback().then(result => {
                if (result.success) {
                    if (!result.preference) {
                        navigate('/profile-setup'); // 假设有用户偏好页面
                    } else {
                        navigate('/explore');
                    }
                } else {
                    console.error(result.error);
                    // 设置全局错误状态以便在 LoginForm 中显示
                    setIsLoading(false); // 取消加载状态
                }
            });
        } else if (
            pathname.includes("forget-password") ||
            pathname.includes("reset")
        ) {
            setIsLoading(false); // 取消加载状态
            return;
        } else {
            navigate("/login");
            setIsLoading(false); // 取消加载状态
        }

        return () => { };
    }, [navigate, pathname]);

    const updateUserData = async () => {
        try {
            const tripResponse = await fetchWithJwt("/api/v1/trip", "GET");
            const tripData = await tripResponse.json();
            if (tripResponse.ok) {
                const storedUserData = JSON.parse(sessionStorage.getItem("user"));
                const userData = {
                    user_name: storedUserData.user_name,
                    trips: tripData.user_trip
                };
                setUser(userData);
                sessionStorage.setItem("user", JSON.stringify(userData)); // Optional: Store user data in sessionStorage
                console.log(userData);
                return { success: true, error: null };
            } else {
                throw new Error("Failed to fetch trips");
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, login, logout, user, updateUserData, userInfo, handleGoogleLoginCallback, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
