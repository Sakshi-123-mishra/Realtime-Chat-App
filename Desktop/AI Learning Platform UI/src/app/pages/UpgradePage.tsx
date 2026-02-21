import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, X } from 'lucide-react';
import Navbar from '@/app/components/Navbar';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  current?: boolean;
  popular?: boolean;
}

const UpgradePage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans: Plan[] = [
    {
      name: 'Free',
      price: 0,
      description: 'Get started with learning',
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Certificates', included: true },
        { name: 'Community access', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'AI-powered recommendations', included: false },
      ],
      cta: 'Current Plan',
      current: true,
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? 9.99 : 99.9,
      description: 'Enhanced learning experience',
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Certificates', included: true },
        { name: 'Community access', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'AI-powered recommendations', included: false },
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Elite',
      price: billingCycle === 'monthly' ? 19.99 : 199.9,
      description: 'Premium learning with AI',
      features: [
        { name: 'Access to all courses', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Certificates', included: true },
        { name: 'Community access', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'AI-powered recommendations', included: true },
      ],
      cta: 'Upgrade to Elite',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Select the plan that best fits your learning goals. Upgrade anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-lg border transition-all ${
                  plan.popular
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 bg-white'
                } p-8`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8 pt-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{plan.description}</p>

                  {/* Price */}
                  <div className="mt-6">
                    {plan.price === 0 ? (
                      <p className="text-3xl font-bold text-gray-900">Free</p>
                    ) : (
                      <>
                        <p className="text-4xl font-bold text-gray-900">
                          ${plan.price.toFixed(2)}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          per {billingCycle === 'monthly' ? 'month' : 'year'}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    if (!plan.current) {
                      navigate('/profile');
                    }
                  }}
                  disabled={plan.current}
                  className={`w-full py-3 rounded-lg font-medium transition-colors mb-8 flex items-center justify-center gap-2 ${
                    plan.current
                      ? 'bg-gray-100 text-gray-600 cursor-default'
                      : plan.popular
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                  {!plan.current && <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Can I change my plan anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 30-day money-back guarantee if you are not satisfied with your plan.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes, start with our Free plan to explore all features before upgrading.',
                },
                {
                  q: 'Do you offer team plans?',
                  a: 'Yes, contact our sales team for custom team pricing and features.',
                },
              ].map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
