'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Text, Heading } from '@/components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Flex } from '@/components/ui/Layout';
import { useDemoAuth } from '@/contexts/DemoAuthContext';

interface EmailRecognitionLoginProps {
  onNewUser: () => void;
  onSuccess?: () => void;
}

const EmailRecognitionLogin: React.FC<EmailRecognitionLoginProps> = ({ 
  onNewUser, 
  onSuccess 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useDemoAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const result = await response.json();

      if (result.success) {
        // Login successful - restore session
        login(result.user, result.sessionToken);
        setShowSuccess(true);
        
        // Call success callback after a brief delay to show success message
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
        
      } else if (result.isNewUser) {
        // No existing account found - redirect to signup
        onNewUser();
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <div className="mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <Heading level={3} className="mb-2 text-green-700">
            Welcome Back!
          </Heading>
          <Text className="text-green-600 mb-4">
            Your demo account has been restored successfully.
          </Text>
          <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Welcome to Kamunity! 👋
        </CardTitle>
        <Text className="text-center text-gray-600">
          Enter your email to continue your demo or start a new one
        </Text>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <Text className="text-red-700 text-sm">{error}</Text>
            </div>
          )}

          <Flex gap="md" className="w-full">
            <Button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <Flex align="center" gap="sm">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Checking...</span>
                </Flex>
              ) : (
                'Continue'
              )}
            </Button>
          </Flex>

          <div className="text-center pt-4 border-t">
            <Text className="text-sm text-gray-500 mb-2">
              First time here?
            </Text>
            <Button
              type="button"
              variant="outline"
              onClick={onNewUser}
              disabled={isLoading}
              className="w-full"
            >
              Start New Demo
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t">
          <Text className="text-xs text-gray-400 text-center">
            This is a demo environment. Your data is used for demonstration purposes only.
          </Text>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailRecognitionLogin;
