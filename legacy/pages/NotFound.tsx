import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/LumaMark';
import { ArrowRight, HelpCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="grad-hero min-h-screen flex items-center">
      <div className="container-x max-w-md text-center space-y-6">
        <div className="h-14 w-14 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mx-auto">
          <HelpCircle size={28} />
        </div>
        <h1 className="font-display text-4xl font-extrabold text-ink-900 tracking-tight">404 — Lost in queue</h1>
        <p className="text-sm text-ink-500 leading-relaxed">
          The page you are looking for does not exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <Link to="/" className="btn btn-primary btn-md">
            Go back home
          </Link>
          <Link to="/book" className="btn btn-outline btn-md">
            Book a ticket
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
