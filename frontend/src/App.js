import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import * as constants from "./constants";

import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useWindowSize } from "./hooks/useWindowSize";
import Header from "./component/Header";
import { HeaderProvider } from './component/HeaderContext';
import Footer from "./component/Footer";
import Login from "./page/Login";
import Edit from "./page/Edit";
import Explore from "./page/Explore";
import MyTrips from "./page/MyTrips";
import ViewPost from "./page/ViewPost";
import ForgotPassword from "./page/Forgot-password";
import ResetPassword from "./page/Reset-password";
import ProfileSetup from "./page/ProfileSetup";
import Profile from "./page/Profile";
import NotFound from "./page/NotFound";
import SettingOptions from "./page/SettingOptions";

import AIAssistant from "./page/AIAssistant";

function App() {
    const { isDarkMode } = useTheme();
    const { isLoggedIn } = useAuth();
    // const navigate = useNavigate();
    const windowSize = useWindowSize();

    return (
        <div className="App" theme={isDarkMode ? "dark" : "light"}>
            <HeaderProvider>
                <Header />
                <Routes>
                    {/* <Route path="/"> */}
                    <Route
                        path="/"
                        element={
                            isLoggedIn ? (
                                <Navigate to="explore" replace={true} />
                            ) : (
                                <Navigate to="login" replace={true} />
                            )
                        }
                    />
                    
                    <Route path="explore" element={<Explore />} />
                    <Route path="login" element={<Login />} />
                    <Route path="forget-password" element={<ForgotPassword />} />
                    <Route path="reset" element={<ResetPassword />} />
                    <Route path="profile-setup" element={<ProfileSetup />} />
                    <Route path="edit" element={<Edit />} />
                    <Route path="edit/:id" element={<Edit />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="mytrips" element={<MyTrips />} />
                    <Route path="post/:id" element={<ViewPost />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="setting-options" element={<SettingOptions />} />
                    <Route path="assistant" element={<AIAssistant />} />
                    <Route path="*" element={<NotFound />} />
                    {/* </Route> */}
                </Routes>
            </HeaderProvider>
            {windowSize.width < constants.MOBILE_SCREEN_WIDTH && isLoggedIn && <Footer />}
        </div>
    );
}

export default App;
