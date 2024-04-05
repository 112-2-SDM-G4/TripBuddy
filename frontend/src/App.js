import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";

import Header from "./component/Header";
import Login from "./page/Login";
import Edit from "./page/Edit";
import Explore from "./page/Explore";
import Reset from "./page/Reset";
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
                    <Route path="reset" element={<Reset />} />
                    <Route path="edit" element={<Edit />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
