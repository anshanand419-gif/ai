import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  Flame, 
  Clock, 
  Star,
  ArrowRight,
  Crown
} from 'lucide-react';
import { PLANS, MONTHLY_PLANS } from '../../data/mockData';
import { PlanTier, BillingCycle, UserProfile } from '../../types';

interface PricingPlansProps {
  onOpenCheckout: (plan: PlanTier, cycle: BillingCycle) => void;
  user: UserProfile;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({
  onOpenCheckout,
  user,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('bundle');

  const currentPlans = billingCycle === 'bundle' ? PLANS : MONTHLY_PLANS;

  const faqs = [
    {
      q: 'How do AI Generation Credits work?',
      a: 'Each tool consumes between 3 to 8 credits per generation (e.g., 5 credits for a 4K 3D cartoon video, 8 credits for video dubbing with lip-sync). Credits automatically refresh each month of your plan term.',
    },
    {
      q: 'What is included in the Multi-Month Bundles?',
      a: 'Bundles lock in the lowest price per month ($49.50/mo on Pro, or $59.80/mo on Ultimate with Unlimited credits) and include 4K rendering, commercial rights, priority server access, and watermark removal.',
    },
    {
      q: 'Can I use videos generated on PixAI Studio for commercial ads and monetization?',
      a: 'Yes! Both Pro and Ultimate plans include a Full Commercial License allowing you to monetize on YouTube, TikTok, Instagram, TV ads, and client work with 0 royalties.',
    },
    {
      q: 'What happens if I need more credits?',
      a: 'You can upgrade your plan or top up instant credit packs at any time directly through your dashboard.',
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Flexible Plans Built for Creators & Studios</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Unlock Unlimited AI Video & Animation Power
        </h1>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Choose a multi-month bundle for maximum savings, or subscribe on a flexible monthly schedule. Cancel or upgrade anytime with Stripe security.
        </p>

        {/* Toggle Switch */}
        <div className="pt-2 flex items-center justify-center">
          <div className="bg-[#0d0f17] p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-lg">
            <button
              onClick={() => setBillingCycle('bundle')}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                billingCycle === 'bundle'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Multi-Month Bundles</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
                Save 40%
              </span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Subscription
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {currentPlans.map((plan) => {
          const isUserPlan = user.plan === plan.name;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#181c33] via-[#0f1220] to-[#0a0c14] border-2 border-indigo-500/80 shadow-2xl neon-glow-indigo transform md:-translate-y-2'
                  : 'bg-[#0d0f17] border border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Badge if Popular */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center justify-between">
                    <span>{plan.name}</span>
                    {isUserPlan && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Plan
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                      ${plan.totalPrice}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {plan.monthsCount > 1 ? `for ${plan.monthsCount} Months` : '/ month'}
                    </span>
                  </div>
                  {plan.monthsCount > 1 && (
                    <div className="text-[11px] font-medium text-emerald-400">
                      Just ${plan.priceMonthly.toFixed(2)}/month equivalent
                    </div>
                  )}
                </div>

                {/* Credits Callout */}
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Credits Included:</span>
                  <span className="font-extrabold text-cyan-300">
                    {plan.creditsPerMonth === 'Unlimited' ? '∞ Unlimited' : `${plan.creditsPerMonth} credits / mo`}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What's included:
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => onOpenCheckout(plan, billingCycle)}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-sm transition transform active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="p-6 bg-[#0d0f17] border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">14-Day Risk-Free Money-Back Guarantee</div>
            <div className="text-slate-400">If you are not 100% satisfied with your video rendering quality, we'll refund every penny.</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-300 font-semibold shrink-0">
          <span>Stripe Certified</span>
          <span>•</span>
          <span>Instant Credit Top-Up</span>
          <span>•</span>
          <span>Cancel Anytime</span>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 bg-[#0d0f17] border border-slate-800 rounded-xl space-y-2">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
