import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { LanguageProvider } from "./hooks/useLanguage";
import Sidebar from "./component/Sidebar";
import Login from "./page/Login";
import Edit from "./page/Edit";
import Reset from "./page/Reset";
import NotFound from "./page/NotFound";
import { ColorButton } from "./component/ColorButton";
import { useState } from "react";

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return (
        <div className="App" theme={isDarkMode ? "dark" : "light"}>
            <ColorButton
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            ></ColorButton>
            <LanguageProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/">
                            <Route path="login" element={<Login />} />
                            <Route path="reset" element={<Reset />} />
                            <Route path="edit" element={<Edit />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </LanguageProvider>
        </div>
    );
}

export default App;
