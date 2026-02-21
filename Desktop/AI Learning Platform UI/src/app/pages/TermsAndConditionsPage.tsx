import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, Check, Loader2 } from 'lucide-react';
import logoImage from "@/assets/logo.png";

export default function TermsAndConditionsPage() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Mark terms as read when component mounts
  useEffect(() => {
    sessionStorage.setItem('termsPageVisited', 'true');
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    setIsScrolledToBottom(isAtBottom);
    setShowBackToTop(element.scrollTop > 300);
  };

  const handleAgree = () => {
    if (!isScrolledToBottom) {
      alert('Please scroll to the bottom and read the entire Terms & Conditions.');
      return;
    }
    setIsLoading(true);
    // Mark terms as accepted in localStorage and sessionStorage
    localStorage.setItem('termsAccepted', JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
    sessionStorage.setItem('termsAccepted', 'true');
    
    // Small delay for UX feedback
    setTimeout(() => {
      navigate('/signup', { replace: true });
    }, 500);
  };

  const handleBackToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a52] to-[#2d5f7e] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="E learn" className="h-8 w-8 object-contain" />
            <h1 className="text-2xl font-bold text-white">Terms & Conditions</h1>
          </div>
          <button
            onClick={() => navigate('/signup')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Scrollable Content Area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-[70vh] overflow-y-auto p-8 space-y-8"
          >
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to E learn Platform ("Service"). These Terms & Conditions ("Terms") govern your access to and use of our website, 
                mobile application, and all related services. By accessing and using the Service, you agree to be bound by these Terms. 
                If you do not agree with any part of these Terms, you may not use the Service.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                As a user of E learn Platform, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide accurate, complete, and current information when registering your account</li>
                <li>Maintain the confidentiality of your account credentials and password</li>
                <li>Accept full responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
                <li>Use the Service in compliance with all applicable laws and regulations</li>
                <li>Not share your account with unauthorized third parties</li>
              </ul>
            </section>

            {/* Account Usage Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Usage Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Your account on E learn Platform is personal and non-transferable. You may create only one personal account 
                and are responsible for maintaining the security of your login credentials. We reserve the right to suspend 
                or terminate accounts that violate this policy or engage in suspicious activity.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Multiple accounts for the same individual are prohibited and may result in account termination.
              </p>
            </section>

            {/* Privacy Policy Summary */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. E learn Platform collects personal information necessary to provide and improve 
                our services. For complete details on how we collect, use, and protect your data, please refer to our full 
                Privacy Policy. By using our Service, you consent to our data practices as outlined in our Privacy Policy.
              </p>
            </section>

            {/* Data Collection & Usage */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Collection & Usage</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                E learn Platform may collect the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3">
                <li>Account information (name, email, phone number)</li>
                <li>Professional information (job title, company, skills)</li>
                <li>Learning history and progress data</li>
                <li>Device information and IP addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                This data is used to personalize your experience, improve our services, and communicate important updates 
                about your account and our platform.
              </p>
            </section>

            {/* Security Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Security Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                E learn Platform implements industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3">
                <li>End-to-end encryption for sensitive data transmission</li>
                <li>Secure authentication protocols and password hashing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Compliance with GDPR and international data protection standards</li>
                <li>Two-factor authentication (2FA) for enhanced account security</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                However, no security measure is impenetrable. Users must take responsibility for maintaining their account security.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Users are strictly prohibited from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Harassing, threatening, or defaming other users</li>
                <li>Uploading viruses, malware, or harmful code</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Engaging in phishing, fraud, or deceptive practices</li>
                <li>Spamming or sending unsolicited communications</li>
                <li>Distributing copyrighted content without authorization</li>
                <li>Using automated tools to scrape or extract data</li>
                <li>Reselling or redistributing our services</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                All content on E learn Platform, including but not limited to course materials, videos, articles, graphics, 
                logos, and software, is the intellectual property of E learn Platform or its content providers and is protected 
                by international copyright laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Users may view and download content for personal, non-commercial use only. Reproduction, distribution, or 
                modification of content without express written permission is prohibited.
              </p>
            </section>

            {/* Termination Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                E learn Platform reserves the right to terminate or suspend your account immediately, without notice, if:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3">
                <li>You violate any provision of these Terms</li>
                <li>You engage in fraudulent or illegal activities</li>
                <li>You harass or harm other users</li>
                <li>You attempt to compromise platform security</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, you lose access to your account and all associated content. We may retain your data for 
                legal and security purposes.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>E learn Platform is provided "as is" without warranties of any kind</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to the amount you paid for the Service</li>
                <li>We are not responsible for third-party content or services</li>
                <li>We cannot guarantee uninterrupted or error-free service</li>
              </ul>
            </section>

            {/* Updates to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                E learn Platform reserves the right to modify these Terms at any time. Changes will be effective immediately 
                upon posting to the website. Your continued use of the Service following the posting of revised Terms means 
                that you accept and agree to the changes. We encourage you to review these Terms regularly to stay informed 
                about your rights and responsibilities.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have any questions about these Terms & Conditions or need to report a violation, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> support@elearn.com
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Website:</span> www.elearn.com
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Last Updated:</span> January 2026
                </p>
              </div>
            </section>

            {/* Footer Text */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 text-center">
                By clicking "I Agree" below, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms & Conditions. You also consent to our collection and use of your data as described in our Privacy Policy.
              </p>
            </section>
          </div>

          {/* Fixed Footer with Agreement Button */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 sticky bottom-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                {isScrolledToBottom ? (
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    You've read the complete Terms & Conditions
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Please scroll to the bottom to continue
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Decline
                </button>
                <button
                  onClick={handleAgree}
                  disabled={!isScrolledToBottom || isLoading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isScrolledToBottom && !isLoading
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'I Agree & Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={handleBackToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all animate-bounce"
            title="Back to top"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
