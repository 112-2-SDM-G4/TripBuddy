import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import * as constants from "./constants";

import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useWindowSize } from "./hooks/useWindowSize";
import ProtectedRoute from "./hooks/ProtectedRoute";
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
    const { isLoggedIn } = useAuth();
    // const navigate = useNavigate();
    const windowSize = useWindowSize();

    return (
        <div className="App" theme={isDarkMode ? "dark" : "light"}>
            {/* {isLoggedIn && <Header />} */}
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
                <Route
                    path="explore"
                    element={
                        <ProtectedRoute>
                            <Explore />
                        </ProtectedRoute>
                    }
                />
                <Route path="login" element={<Login />} />
                <Route path="forget-password" element={<ForgotPassword />} />
                <Route path="reset" element={<ResetPassword />} />
                <Route
                    path="profile-setup"
                    element={
                        <ProtectedRoute>
                            <ProfileSetup />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="edit"
                    element={
                        <ProtectedRoute>
                            <Edit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="edit/:id"
                    element={
                        <ProtectedRoute>
                            <Edit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="explore"
                    element={
                        <ProtectedRoute>
                            <Explore />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="mytrips"
                    element={
                        <ProtectedRoute>
                            <MyTrips />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="spot/:id"
                    element={
                        <ProtectedRoute>
                            <ViewSpot />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <NotFound />
                        </ProtectedRoute>
                    }
                />
                {/* </Route> */}
            </Routes>
            {windowSize.width < constants.MOBILE_SCREEN_WIDTH && <Footer />}
        </div>
    );
}

export default App;
