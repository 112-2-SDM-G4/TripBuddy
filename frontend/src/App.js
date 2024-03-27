import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Login from "./page/Login";
import Edit from "./page/Edit";
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
            <AuthProvider>
                <Routes>
                    <Route path="/">
                        <Route path="login" element={<Login />} />
                        <Route path="edit" element={<Edit />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </div>
    );
}

export default App;
