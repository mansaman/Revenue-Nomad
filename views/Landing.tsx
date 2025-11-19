import React from 'react';
import { ViewState } from '../types';
import { Button } from '../components/Button';
import { ArrowRight, Code, Lock, Zap, CheckCircle2, FileJson, Database } from 'lucide-react';

interface LandingProps {
  onChangeView: (view: ViewState) => void;
}

export const Landing: React.FC<LandingProps> = ({ onChangeView }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-8">
              Capture Revenue. <br />
              <span className="text-[#70A25B] bg-clip-text text-transparent bg-gradient-to-r from-[#70A25B] to-emerald-600">
                Secure Your Content.
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              RevenueNomad is a modular, embeddable lead capture system. 
              Validate users, trigger webhooks, and deliver protected resources seamlessly with token-based security.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => onChangeView(ViewState.DEMO_FORM)} 
                className="text-lg px-8 py-4 rounded-full"
              >
                Try Demo Form
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-full"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#70A25B] rounded-full blur-3xl -z-10 opacity-5" />
      </div>

      {/* Feature Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[#70A25B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Token-Based Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced JWT-like token system ensures only verified users who have completed the submission can access your valuable resources.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#70A25B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Webhook Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly connects to Google Apps Script, Zapier, or any REST API endpoint for instant data delivery and CRM syncing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-[#70A25B]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Embeddable Widget</h3>
              <p className="text-gray-600 leading-relaxed">
                Drop into any website via iframe or React component. Works perfectly with WordPress, Webflow, or custom HTML stacks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-500">From visitor to secured lead in four steps</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { 
                  title: 'User Fills Form', 
                  desc: 'Captures validated data points', 
                  icon: <FileJson className="w-6 h-6 text-white" />, 
                  color: 'bg-[#70A25B]' 
                },
                { 
                  title: 'Data via Webhook', 
                  desc: 'Transmitted to your backend', 
                  icon: <Database className="w-6 h-6 text-white" />, 
                  color: 'bg-[#598248]' 
                },
                { 
                  title: 'Token Generated', 
                  desc: 'Signed time-limited access', 
                  icon: <Lock className="w-6 h-6 text-white" />, 
                  color: 'bg-emerald-600' 
                },
                { 
                  title: 'Access Granted', 
                  desc: 'Redirect to secure resource', 
                  icon: <CheckCircle2 className="w-6 h-6 text-white" />, 
                  color: 'bg-emerald-500' 
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                  <div className="mt-4 font-mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Step {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};