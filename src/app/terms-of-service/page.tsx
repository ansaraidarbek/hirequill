import type { Metadata } from 'next';
import Footer from '@/components/common/Footer';
import TermsContent from './components/TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service - HireQuill AI',
  description: 'Clear usage guidelines and limitations for HireQuill AI cover letter generation service. Understand your rights, service boundaries, and subscription terms.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">
          <TermsContent />
        </main>
        <Footer />
    </div>
  );
}