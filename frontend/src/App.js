import React from "react";
import { Routes, Route } from "react-router-dom";

import * as constants from "./constants";

//import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useWindowSize } from "./hooks/useWindowSize";

import Header from "./component/Header";
import Footer from "./component/Footer";
import Login from "./page/Login";
import Edit from "./page/Edit";
import Explore from "./page/Explore";
import MyTrips from "./page/MyTrips";
import ViewSpot from "./page/ViewSpot";
import ForgotPassword from "./page/Forgot-password";
import ResetPassword from "./page/Reset-password";
import ProfileSetup from "./page/ProfileSetup";
import NotFound from "./page/NotFound";

function App() {
    const { isDarkMode } = useTheme();
    //const { isLoggedIn } = useAuth();
    const windowSize = useWindowSize();

    return (
        <div className="App" theme={isDarkMode ? "dark" : "light"}>
            {/* {isLoggedIn && <Header />} */}
            <Header />
            {windowSize.width < constants.MOBILE_SCREEN_WIDTH && <Footer />}
            <Routes>
                <Route path="/">
                    <Route path="login" element={<Login />} />
                    <Route path="reset" element={<ForgotPassword />} />
                    <Route path="reset/:token" element={<ResetPassword />} />
                    <Route path="profile-setup" element={<ProfileSetup />} />
                    <Route path="edit" element={<Edit />} />
                    <Route path="edit/:id" element={<Edit />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="mytrips" element={<MyTrips />} />
                    <Route path="spot/:id" element={<ViewSpot />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
