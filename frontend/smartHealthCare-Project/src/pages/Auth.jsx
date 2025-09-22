import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Chrome,
  Github
} from 'lucide-react';
import api from '../sevices/api.js'

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    role: 'patient', // Default role
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match!");
        }
        const { fullName, email, password, role } = formData;
        await api.register({ name: fullName, email, password, role });
        // Optionally, automatically log them in or show a "please login" message
        toggleAuthMode(); // Switch to sign-in form after successful registration
      } else {
        const { email, password } = formData;
        const { user } = await api.login({ email, password });
        // Redirect based on user role
        if (user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      agreeToTerms: false
    });
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Panel - Welcome/Info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'signup-info' : 'signin-info'}
                  className="flex-1 bg-gradient-to-br from-purple-600/80 to-blue-600/80 backdrop-blur-sm p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden"
                  initial={{ x: isSignUp ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: isSignUp ? 100 : -100, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div className="relative z-10">
                    {!isSignUp ? (
                      <>
                        <motion.h2
                          className="text-4xl lg:text-5xl font-bold mb-6"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Welcome Back!
                        </motion.h2>
                        <motion.p
                          className="text-lg mb-8 text-white/90"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Enter your personal details to continue your journey with us
                        </motion.p>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Button
                            onClick={toggleAuthMode}
                            variant="outline"
                            className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 px-8 py-3 rounded-full"
                          >
                            Sign Up
                          </Button>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.h2
                          className="text-4xl lg:text-5xl font-bold mb-6"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Join Us Today!
                        </motion.h2>
                        <motion.p
                          className="text-lg mb-8 text-white/90"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Create an account and discover a great amount of new opportunities
                        </motion.p>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Button
                            onClick={toggleAuthMode}
                            variant="outline"
                            className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 px-8 py-3 rounded-full"
                          >
                            Sign In
                          </Button>
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-xl" />
                  <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
                </motion.div>
              </AnimatePresence>

              {/* Right Panel - Forms */}
              <div className="flex-1 bg-white/95 backdrop-blur-sm p-8 lg:p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isSignUp ? (
                    <motion.div
                      key="signin-form"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full max-w-md mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h3>
                        <p className="text-gray-600">Welcome back! Please sign in to your account</p>
                      </div>

                      {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                          <span className="block sm:inline">{error}</span>
                        </div>
                      )}
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                              className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Enter your password"
                              className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="rememberMe"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onCheckedChange={(checked) =>
                                handleInputChange({ target: { name: 'rememberMe', type: 'checkbox', checked } })
                              }
                            />
                            <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                              Remember me
                            </Label>
                          </div>
                          <button
                            type="button"
                            className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                        >
                          {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <Chrome className="w-5 h-5 mr-2" />
                            Google
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <Github className="w-5 h-5 mr-2" />
                            GitHub
                          </Button>
                        </div>

                        <p className="text-center text-sm text-gray-600">
                          Don't have an account?{' '}
                          <button
                            type="button"
                            onClick={toggleAuthMode}
                            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                          >
                            Sign up
                          </button>
                        </p>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup-form"
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full max-w-md mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
                        <p className="text-gray-600">Fill in your information to get started</p>
                      </div>

                      {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                          <span className="block sm:inline">{error}</span>
                        </div>
                      )}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="fullName"
                              name="fullName"
                              type="text"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                              className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Create a password"
                              className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="Confirm your password"
                              className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="agreeToTerms"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) =>
                              handleInputChange({ target: { name: 'agreeToTerms', type: 'checkbox', checked } })
                            }
                            required
                          />
                          <Label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                            I agree to the{' '}
                            <button type="button" className="text-purple-600 hover:text-purple-700 transition-colors">
                              Terms of Service
                            </button>
                            {' '}and{' '}
                            <button type="button" className="text-purple-600 hover:text-purple-700 transition-colors">
                              Privacy Policy
                            </button>
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                        >
                          {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <Chrome className="w-5 h-5 mr-2" />
                            Google
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <Github className="w-5 h-5 mr-2" />
                            GitHub
                          </Button>
                        </div>

                        <p className="text-center text-sm text-gray-600">
                          Already have an account?{' '}
                          <button
                            type="button"
                            onClick={toggleAuthMode}
                            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                          >
                            Sign in
                          </button>
                        </p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
