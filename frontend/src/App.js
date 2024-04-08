import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";

import Header from "./component/Header";
import Login from "./page/Login";
import Edit from "./page/Edit";
import Explore from "./page/Explore";
import ForgotPassword from "./page/Forgot-password";
import ResetPassword from "./page/Reset-password";
import EmailVerification from './page/EmailVerification';
import ProfileSetup from './page/ProfileSetup';
import NotFound from "./page/NotFound";

function App() {
    const { isDarkMode } = useTheme();
    const { isLoggedIn } = useAuth();
    return (
        <div className="App" theme={isDarkMode ? "dark" : "light"}>
            {/* {isLoggedIn && <Header />} */}
            <Header />
            <Routes>
                <Route path="/">
                    <Route path="login" element={<Login />} />
                    <Route path="reset" element={<ForgotPassword />} />
                    <Route path="reset/:token" element={<ResetPassword />} /> 
                    <Route path="verify-email/:token" element={<EmailVerification />} />
                    <Route path="profile-setup" element={<ProfileSetup />} />
                    <Route path="edit" element={<Edit />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
