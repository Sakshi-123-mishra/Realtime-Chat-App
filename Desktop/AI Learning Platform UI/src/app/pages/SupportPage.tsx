import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/app/components/Navbar';

interface FAQ {
  question: string;
  answer: string;
  open: boolean;
}

const SupportPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: 'How do I reset my password?',
      answer: 'Go to Profile > Change Password or use the "Forgot Password" link on the login page.',
      open: false,
    },
    {
      question: 'How can I track my learning progress?',
      answer: 'Visit "My Courses" from your profile to see detailed progress, hours spent, and completion status for each course.',
      open: false,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and UPI payments. All transactions are secure and encrypted.',
      open: false,
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee. Contact support if you are not satisfied with your purchase.',
      open: false,
    },
    {
      question: 'How do I upgrade my plan?',
      answer: 'Click on "Upgrade Plan" in your profile or navbar, choose your desired plan, and complete the payment.',
      open: false,
    },
    {
      question: 'Are certificates provided?',
      answer: 'Yes, you receive a certificate upon completing each course. Certificates are available in your profile.',
      open: false,
    },
  ]);

  const toggleFAQ = (index: number) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, open: !faq.open } : faq))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call - replace with actual support ticket creation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, send to support system or email service
      // await createSupportTicket({ userId: user.uid, ...contactForm });

      setMessage({ 
        type: 'success', 
        text: 'Your message has been sent! Our support team will respond within 24 hours.' 
      });
      setContactForm({ subject: '', message: '' });
    } catch (error) {
      console.error('Submit support error:', error);
      setMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Help & Support</h1>
            <p className="text-gray-600">Get help and contact our support team</p>
          </div>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <a
              href="mailto:support@elearn.com"
              className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <Mail className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-600">support@elearn.com</p>
              </div>
            </a>

            <button
              onClick={() => alert('Chat support coming soon!')}
              className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left"
            >
              <MessageCircle className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Chat with us now</p>
              </div>
            </button>
          </div>

          {/* FAQ Section */}
          <div className="border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {faq.open ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {faq.open && (
                    <div className="px-4 pb-4 text-gray-600 text-sm border-t border-gray-200 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h2>
            <p className="text-sm text-gray-600 mb-6">
              Can't find what you're looking for? Send us a message.
            </p>

            {/* Success/Error Message */}
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  placeholder="What do you need help with?"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  placeholder="Describe your issue or question in detail..."
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
