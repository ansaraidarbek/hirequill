import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import TermsContent from './components/TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service - CoverCraft AI',
  description: 'Clear usage guidelines and limitations for CoverCraft AI cover letter generation service. Understand your rights, service boundaries, and subscription terms.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <TermsContent />
      </main>
      <Footer />
    </div>
  );
}