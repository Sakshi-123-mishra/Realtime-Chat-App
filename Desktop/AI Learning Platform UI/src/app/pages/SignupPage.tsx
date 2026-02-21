import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, Check, X, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { FirebaseError } from 'firebase/app';
import logoImage from "@/assets/logo.png";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loginWithGithub } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    terms: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has visited terms page on component mount
  useEffect(() => {
    // Keep for future use if needed, but don't enforce it
    setIsLoading(false); // Ensure loading state is reset on mount
  }, []);

  const getFirebaseErrorMessage = (error: FirebaseError): string => {
    console.error('Firebase Error:', error.code, error.message);
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/account-exists-with-different-credential':
        return 'This email is already linked with a different login method. Please login with Google or Email first, then try GitHub again.';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/too-many-requests':
        return 'Too many signup attempts. Please try again later';
      case 'auth/operation-not-allowed':
        return 'Email/password signup is not enabled';
      default:
        return error.message || 'Failed to create account. Please try again';
    }
  };

  // Password validation
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return validations;
  };

  const isPasswordValid = (password: string) => {
    const validations = validatePassword(password);
    return validations.length && validations.uppercase && validations.number && validations.special;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const passwordValidations = validatePassword(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading || isSubmitting) return;
    
    setIsSubmitting(true);
    setErrors({ firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '', terms: '', general: '' });

    // Validation
    let hasError = false;
    const newErrors = { firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '', terms: '', general: '' };

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      hasError = true;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      hasError = true;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (!isPasswordValid(password)) {
      newErrors.password = 'Password does not meet requirements';
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (!agreeToTerms) {
      newErrors.terms = 'Please accept Terms & Conditions';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Firebase signup
    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await signup(email, password, fullName);
      navigate('/dashboard');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setErrors({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        mobile: '', 
        password: '', 
        confirmPassword: '',
        terms: '',
        general: getFirebaseErrorMessage(firebaseError)
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setErrors({ firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '', terms: '', general: '' });
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setErrors({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        mobile: '', 
        password: '', 
        confirmPassword: '',
        terms: '',
        general: getFirebaseErrorMessage(firebaseError)
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setIsLoading(true);
    setErrors({ firstName: '', lastName: '', email: '', mobile: '', password: '', confirmPassword: '', terms: '', general: '' });
    try {
      await loginWithGithub();
      navigate('/dashboard');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setErrors({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        mobile: '', 
        password: '', 
        confirmPassword: '',
        terms: '',
        general: getFirebaseErrorMessage(firebaseError)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logoImage} alt="E learn" className="h-16 w-16 object-contain" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
          <p className="text-center text-gray-600 text-sm mb-6">Sign up to get started</p>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading || isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm">Google</span>
            </button>

            {/* GitHub Button */}
            <button
              type="button"
              onClick={handleGithubSignup}
              disabled={isLoading || isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-600 text-sm font-medium">Or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrors({ ...errors, firstName: '' });
                    }}
                    className={`w-full pl-10 pr-3 py-3 bg-gray-50 border ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="First Name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrors({ ...errors, lastName: '' });
                    }}
                    className={`w-full pl-10 pr-3 py-3 bg-gray-50 border ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Last Name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Email Id"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setErrors({ ...errors, mobile: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                    errors.mobile ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Mobile"
                />
              </div>
              {errors.mobile && (
                <p className="mt-1.5 text-sm text-red-600">{errors.mobile}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
              
              {/* Password Requirements */}
              {password && (
                <div className="mt-2 space-y-1">
                  {[
                    { label: 'At least 8 characters', met: passwordValidations.length },
                    { label: 'Contains uppercase letter', met: passwordValidations.uppercase },
                    { label: 'Contains number', met: passwordValidations.number },
                    { label: 'Contains special character', met: passwordValidations.special }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    setErrors({ ...errors, terms: '' });
                  }}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button 
                    type="button" 
                    onClick={() => navigate('/terms')}
                    className="text-orange-500 hover:text-orange-600 font-medium underline"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1.5 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Have account & Forgot Password */}
            <div className="text-sm text-gray-700">
              <span>Have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-gray-700 hover:text-[#1a3a52] font-medium"
              >
                Forgot password
              </button>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
