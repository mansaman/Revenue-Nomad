
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ViewState, Resource } from '../types';
import { getTokenPayload, verifyToken, clearToken } from '../services/authService';
import { getResources } from '../services/resourceService';
import { Button } from '../components/Button';
import { Download, FileText, Share2, ShieldCheck, FileSpreadsheet, File, Clock } from 'lucide-react';

interface ProtectedResourceProps {
  onChangeView: (view: ViewState) => void;
}

const CHART_DATA = [
  { name: 'Jan', leads: 400, conversion: 240 },
  { name: 'Feb', leads: 300, conversion: 139 },
  { name: 'Mar', leads: 200, conversion: 980 },
  { name: 'Apr', leads: 278, conversion: 390 },
  { name: 'May', leads: 189, conversion: 480 },
  { name: 'Jun', leads: 239, conversion: 380 },
];

export const ProtectedResource: React.FC<ProtectedResourceProps> = ({ onChangeView }) => {
  const payload = getTokenPayload();
  const [resources, setResources] = useState<Resource[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    // Initial check
    if (!verifyToken()) {
      onChangeView(ViewState.DEMO_FORM);
      return;
    }
    setResources(getResources());

    // Periodic check for expiration
    const interval = setInterval(() => {
      const isValid = verifyToken();
      if (!isValid) {
        alert('Your session has expired. Please fill the form again to regain access.');
        clearToken();
        onChangeView(ViewState.DEMO_FORM);
      } else {
        // Update time left display
        const currentPayload = getTokenPayload();
        if (currentPayload) {
          const remaining = currentPayload.exp - Date.now();
          if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
          } else {
            setTimeLeft('Expiring...');
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onChangeView]);

  if (!payload) return null;

  const getFileIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="w-8 h-8 text-[#70A25B] mr-3 group-hover:scale-110 transition-transform" />;
        case 'excel': return <FileSpreadsheet className="w-8 h-8 text-green-600 mr-3 group-hover:scale-110 transition-transform" />;
        case 'csv': return <FileSpreadsheet className="w-8 h-8 text-emerald-500 mr-3 group-hover:scale-110 transition-transform" />;
        default: return <File className="w-8 h-8 text-gray-400 mr-3 group-hover:scale-110 transition-transform" />;
    }
  };

  const handleDownload = (resource: Resource) => {
    if (resource.dataUrl) {
        const link = document.createElement("a");
        link.href = resource.dataUrl;
        link.download = resource.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Download connection unavailable for this mock item.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#70A25B] text-white pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          <div className="flex justify-between items-start">
            <div className="flex items-center mb-6">
              <div className="bg-green-400/20 text-green-300 px-3 py-1 rounded-full text-sm font-mono flex items-center border border-green-400/30">
                <ShieldCheck className="w-4 h-4 mr-2" />
                TOKEN VERIFIED: ACCESS GRANTED
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center text-green-50 border border-green-400/30">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono text-sm">Session expires in: {timeLeft}</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">2024 Industry Lead Analysis</h1>
          <p className="text-green-100 text-lg max-w-2xl">
             Welcome back, <span className="text-white font-semibold">{payload.email}</span>. 
             This resource is protected by our RevenueNomad token system.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">Lead Conversion Metrics</h2>
                <select className="text-sm border-gray-300 rounded-md text-gray-600 focus:ring-[#70A25B] focus:border-[#70A25B] bg-white">
                    <option>Last 6 Months</option>
                </select>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#70A25B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#70A25B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="leads" stroke="#70A25B" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Executive Summary</h3>
                <div className="prose text-gray-600">
                    <p className="mb-4">
                        Based on the data collected through our secure endpoints, leads captured via token-gated systems show a <strong>45% higher retention rate</strong> compared to open forms.
                    </p>
                    <p>
                        The implementation of JWT-based validation on the client side, paired with server-side verification (simulated here), drastically reduces spam submissions and ensures that your high-value content remains exclusive to qualified prospects.
                    </p>
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#70A25B]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Resources</h3>
              <div className="space-y-4">
                {resources.map((resource) => (
                    <div 
                        key={resource.id}
                        onClick={() => handleDownload(resource)}
                        className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-green-50 transition-colors cursor-pointer group"
                    >
                        {getFileIcon(resource.type)}
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate pr-2">{resource.name}</p>
                            <p className="text-xs text-gray-500">{resource.size} • {new Date(resource.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0 group-hover:text-[#70A25B]" />
                    </div>
                ))}

                {resources.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No resources available at this time.</p>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button fullWidth variant="secondary">
                    <Share2 className="w-4 h-4 mr-2" /> Share Report
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#70A25B] to-emerald-800 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Need Custom Integration?</h3>
                <p className="text-green-100 text-sm mb-4">
                    We can connect this system to your Salesforce, HubSpot, or custom SQL database.
                </p>
                <Button fullWidth className="bg-white text-[#70A25B] hover:bg-green-50 border-none">
                    Contact Sales
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
