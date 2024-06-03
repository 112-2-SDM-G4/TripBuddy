import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { LanguageProvider } from "./hooks/useLanguage";

test('Click and render forget-password page', async () => {

  render(
    <React.StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </AuthProvider>
            </LanguageProvider>
        </BrowserRouter>
    </React.StrictMode>
  );

  const ForgetPasswordButton = screen.getByRole('link', {name: 'Forget Password?'});
  fireEvent.click(ForgetPasswordButton)

  const EmailInputBox = await screen.findByText('E-mail');
  expect(EmailInputBox).toBeInTheDocument();
});
