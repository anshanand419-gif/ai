/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardHub } from './components/tools/DashboardHub';
import { CartoonGenerator } from './components/tools/CartoonGenerator';
import { ImageToVideoGenerator } from './components/tools/ImageToVideoGenerator';
import { VideoTranslator } from './components/tools/VideoTranslator';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { AdCreator } from './components/tools/AdCreator';
import { AutoCaptioner } from './components/tools/AutoCaptioner';
import { NanoBananaStudio } from './components/tools/NanoBananaStudio';
import { AdobeCreativeStudio } from './components/tools/AdobeCreativeStudio';
import { PinterestDiscovery } from './components/tools/PinterestDiscovery';
import { GeminiVisionStudio } from './components/tools/GeminiVisionStudio';
import { GalleryAssets } from './components/tools/GalleryAssets';
import { PricingPlans } from './components/tools/PricingPlans';
import { StripeCheckoutModal } from './components/StripeCheckoutModal';
import { OwnerPortal } from './components/OwnerPortal';
import { ToolType, UserProfile, GeneratedAsset, PlanTier, BillingCycle } from './types';
import { SAMPLE_ASSETS, PLANS } from './data/mockData';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ToolType>('dashboard');
  const [isLandingView, setIsLandingView] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [remixPrompt, setRemixPrompt] = useState<string>('');

  // User state (Default to mk8111491@gmail.com with SuperAdmin Owner privileges)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pixai_user');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.email === 'alex@creatorstudio.ai' || !parsed.email) {
          parsed.email = 'mk8111491@gmail.com';
          parsed.name = 'MK Admin';
          parsed.isOwner = true;
          parsed.credits = 999999;
          parsed.plan = 'Ultimate Bundle';
        }
        return parsed; 
      } catch {}
    }
    return {
      name: 'MK Admin',
      email: 'mk8111491@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'Ultimate Bundle',
      credits: 999999,
      maxCredits: 999999,
      planExpiry: 'Lifetime SuperAdmin Access',
      isSubscribed: true,
      isOwner: true,
    };
  });

  // Assets state
  const [assets, setAssets] = useState<GeneratedAsset[]>(() => {
    const saved = localStorage.getItem('pixai_assets');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return SAMPLE_ASSETS;
  });

  // Stripe Checkout state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanTier | null>(null);
  const [selectedCycleForCheckout, setSelectedCycleForCheckout] = useState<BillingCycle>('bundle');

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('pixai_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pixai_assets', JSON.stringify(assets));
  }, [assets]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleDeductCredits = (amount: number): boolean => {
    if (user.credits === 999999) return true; // Unlimited
    if (user.credits < amount) {
      showToast(`Insufficient credits! You need ${amount} credits. Please upgrade or top up.`, 'error');
      return false;
    }
    setUser((prev) => ({
      ...prev,
      credits: prev.credits - amount,
    }));
    showToast(`Deducted ${amount} AI Generation Credits. Remaining: ${user.credits - amount}`, 'info');
    return true;
  };

  const handleAddAsset = (asset: GeneratedAsset) => {
    setAssets((prev) => [asset, ...prev]);
    showToast(`"${asset.title}" saved to your Creations!`, 'success');
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    showToast('Asset deleted from gallery.', 'info');
  };

  const handleOpenCheckout = (plan: PlanTier, cycle: BillingCycle = 'bundle') => {
    setSelectedPlanForCheckout(plan);
    setSelectedCycleForCheckout(cycle);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = (plan: PlanTier) => {
    const newCredits = plan.creditsPerMonth === 'Unlimited' ? 999999 : (typeof plan.creditsPerMonth === 'number' ? plan.creditsPerMonth : 250);
    setUser((prev) => ({
      ...prev,
      plan: plan.name as any,
      credits: prev.credits === 999999 ? 999999 : prev.credits + newCredits,
      maxCredits: typeof newCredits === 'number' ? newCredits : 1000,
      isSubscribed: true,
      planExpiry: `Next renewal in ${plan.monthsCount} month${plan.monthsCount > 1 ? 's' : ''}`,
    }));
    showToast(`🎉 Upgraded to ${plan.name}! ${newCredits === 999999 ? 'Unlimited' : newCredits} credits added.`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-500/50 shadow-red-950/50'
              : toast.type === 'info'
              ? 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 shadow-cyan-950/50'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setIsLandingView(false);
          setCurrentTab(tab);
        }}
        user={user}
        isLandingView={isLandingView}
        onToggleLandingView={(landing) => setIsLandingView(landing)}
        onOpenPricing={() => {
          setIsLandingView(false);
          setCurrentTab('pricing');
        }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main View Router */}
      {isLandingView ? (
        <main className="flex-1">
          <LandingPage
            onEnterStudio={(tool) => {
              setIsLandingView(false);
              if (tool) setCurrentTab(tool);
            }}
            onOpenCheckout={(plan, cycle) => handleOpenCheckout(plan, cycle)}
          />
        </main>
      ) : (
        <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            user={user}
            onOpenPricing={() => setCurrentTab('pricing')}
          />

          {/* Center Workspace */}
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            {currentTab === 'dashboard' && (
              <DashboardHub
                onSelectTab={(tab) => setCurrentTab(tab)}
                user={user}
                assets={assets}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'nano-banana' && (
              <NanoBananaStudio
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
                initialPrompt={remixPrompt}
              />
            )}

            {currentTab === 'adobe-studio' && (
              <AdobeCreativeStudio
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'pinterest' && (
              <PinterestDiscovery
                onRemixPrompt={(prompt, targetTool) => {
                  setRemixPrompt(prompt);
                  setCurrentTab(targetTool);
                  showToast('Prompt loaded into Studio for remixing!', 'info');
                }}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'vision-studio' && (
              <GeminiVisionStudio
                onDeductCredits={handleDeductCredits}
                onOpenPricing={() => setCurrentTab('pricing')}
                onRemixToGenerator={(revPrompt) => {
                  setRemixPrompt(revPrompt);
                  setCurrentTab('nano-banana');
                  showToast('Reverse prompt loaded into Nano Banana!', 'info');
                }}
              />
            )}

            {currentTab === 'cartoon' && (
              <CartoonGenerator
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'image2video' && (
              <ImageToVideoGenerator
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'translator' && (
              <VideoTranslator
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'bgremover' && (
              <BackgroundRemover
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'adcreator' && (
              <AdCreator
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'captions' && (
              <AutoCaptioner
                onDeductCredits={handleDeductCredits}
                onAddAsset={handleAddAsset}
                onOpenPricing={() => setCurrentTab('pricing')}
              />
            )}

            {currentTab === 'gallery' && (
              <GalleryAssets
                assets={assets}
                onDeleteAsset={handleDeleteAsset}
                onSelectTool={(tool) => setCurrentTab(tool)}
              />
            )}

            {currentTab === 'pricing' && (
              <PricingPlans
                onOpenCheckout={(plan, cycle) => handleOpenCheckout(plan, cycle)}
                user={user}
              />
            )}

            {currentTab === 'owner' && (
              <OwnerPortal
                currentUser={user}
                onUpdateCurrentUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
                onClose={() => setCurrentTab('dashboard')}
                showToast={showToast}
              />
            )}
          </main>
        </div>
      )}

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plan={selectedPlanForCheckout || PLANS[1]}
        billingCycle={selectedCycleForCheckout}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
