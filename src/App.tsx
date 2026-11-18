import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { SlotOfferBanner } from './components/layout/SlotOfferBanner';
import { CookieBanner } from './components/layout/CookieBanner';
import { BackToTop } from './components/layout/BackToTop';
import { ToastContainer } from './components/layout/ToastContainer';
import { HelpdeskWidget } from './components/layout/HelpdeskWidget';
import { Footer } from './components/layout/Footer';
import { FaqSection } from './components/layout/FaqSection';

// Tab Views
import { CatalogView } from './components/catalog/CatalogView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { MyBookingsView } from './components/bookings/MyBookingsView';
import { LabEquipmentView } from './components/lab/LabEquipmentView';
import { PolymorphicFineSimulator } from './components/simulator/PolymorphicFineSimulator';
import { AuditView } from './components/audit/AuditView';
import { ArchitectureInspector } from './components/architecture/ArchitectureInspector';

// Modals
import { BookingModal } from './components/catalog/BookingModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { AuthModal } from './components/modals/AuthModal';
import { PrintBursarySlip } from './components/modals/PrintBursarySlip';

export const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'catalog':
        return <CatalogView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'my-bookings':
        return <MyBookingsView />;
      case 'lab-equipment':
        return <LabEquipmentView />;
      case 'simulator':
        return <PolymorphicFineSimulator />;
      case 'audit':
        return <AuditView />;
      case 'architecture':
        return <ArchitectureInspector />;
      default:
        return <CatalogView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Skip to Content Accessibility Anchor */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-oxford focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald text-xs font-semibold"
      >
        Skip to main content
      </a>

      {/* 2. Scroll Depth Progress Bar */}
      <ScrollProgress />

      {/* 3. 15-Minute Slot Offer Banner (UC-03) */}
      <SlotOfferBanner />

      {/* 4. Top Sticky Navigation & OOAD Walkthrough Bar */}
      <Navbar />

      {/* 5. Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-12">
        {renderActiveTab()}

        {/* Global Policy FAQ Accordion */}
        <FaqSection />
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Global Floating & Overlay Components */}
      <CookieBanner />
      <BackToTop />
      <HelpdeskWidget />
      <ToastContainer />

      {/* 8. Global Modals & Drawers */}
      <BookingModal />
      <CommandPalette />
      <AuthModal />
      <PrintBursarySlip />
    </div>
  );
};
