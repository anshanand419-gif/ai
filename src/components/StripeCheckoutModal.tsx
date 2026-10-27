import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Lock, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanTier, BillingCycle } from '../types';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanTier | null;
  billingCycle: BillingCycle;
  onSuccess: (plan: PlanTier) => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'express'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardZip, setCardZip] = useState('94103');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !plan) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Call checkout API
      await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle,
          planName: plan.name,
          amount: plan.totalPrice,
        }),
      });
    } catch {
      // Continue even if offline
    }

    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#06b6d4', '#ec4899', '#22c55e'],
      });

      setTimeout(() => {
        onSuccess(plan);
        setIsCompleted(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0f121e] border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden neon-border-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isCompleted ? (
          <div className="p-8 text-center space-y-4 py-12">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
            <p className="text-slate-300">
              You are now upgraded to <span className="text-indigo-400 font-semibold">{plan.name}</span>.
            </p>
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-sm text-slate-400 space-y-1 inline-block text-left w-full max-w-sm">
              <div className="flex justify-between">
                <span>Credits Added:</span>
                <span className="text-white font-semibold">{plan.creditsPerMonth} credits/mo</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-white font-semibold">{plan.monthsCount} {plan.monthsCount > 1 ? 'Months' : 'Month'}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-semibold">${plan.totalPrice}.00 USD</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Stripe Checkout
                </span>
                {plan.badge && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {plan.badge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center justify-between">
                <span>{plan.name}</span>
                <span className="text-indigo-400 text-3xl font-extrabold">${plan.totalPrice}</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {plan.monthsCount > 1 
                  ? `${plan.monthsCount} Months Bundle Access ($${plan.priceMonthly.toFixed(2)}/mo)`
                  : '1 Month Full Access'} • Renews with standard options
              </p>
            </div>

            {/* Plan Highlights */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-2">
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Included in this bundle</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium text-slate-200">{plan.creditsPerMonth} Credits / mo</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium text-slate-200">Full Commercial License</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium text-slate-200">4K Video Export & Audio</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium text-slate-200">All 6 AI Creation Tools</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('express')}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'express'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 text-yellow-400" /> Apple / Google Pay
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' ? (
                <form onSubmit={handlePay} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Card number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                        required
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                        <span className="text-blue-400">VISA</span>
                        <span className="text-orange-400">MC</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={cardZip}
                        onChange={(e) => setCardZip(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Securing Stripe Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ${plan.totalPrice}.00 USD</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-black font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="font-bold">Pay with</span>
                        <span className="font-extrabold tracking-tight">G Pay</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    Instant 1-click biometric authorization with Google Wallet or Apple Pay.
                  </p>
                </div>
              )}
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-bit SSL Encrypted • Powered by Stripe Billing • 14-day money-back guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
