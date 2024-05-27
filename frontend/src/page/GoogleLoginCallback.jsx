import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleLoginCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const jwt_token = searchParams.get('jwt_token');
        const preference = searchParams.get('preference') === 'true';

        if (jwt_token) {
            // 保存 JWT Token 到本地存儲
            localStorage.setItem('jwt_token', jwt_token);
            // 根據用戶偏好進行重定向
            if (preference) {
                navigate('/preferred-page'); // 假設有用戶偏好頁面
            } else {
                navigate('/');
            }
        } else {
            console.error('JWT token is missing in URL');
            navigate('/login'); // 或其他合適的錯誤處理頁面
        }
    }, [location, navigate]);

    return (
        <div>
            Processing login...
        </div>
    );
};

export default GoogleLoginCallback;
