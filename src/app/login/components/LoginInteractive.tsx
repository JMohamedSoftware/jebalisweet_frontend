'use client';

import React, { useState } from 'react';
import ForgotPasswordWizard from './ForgotPasswordWizard';
import LoginForm from './LoginForm';

const LoginInteractive = () => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  const handleLoginSuccess = () => {
    setLoginSuccess(true);
  };

  return (
    <div className="space-y-6">
      <LoginForm
        onSuccess={handleLoginSuccess}
        onForgotPassword={() => setShowRecovery(true)}
      />
      {showRecovery && (
        <ForgotPasswordWizard
          onClose={() => setShowRecovery(false)}
          onSuccess={() => setShowRecovery(false)}
        />
      )}
    </div>
  );
};

export default LoginInteractive;