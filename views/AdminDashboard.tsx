
import React, { useEffect, useState } from 'react';
import { ViewState, Lead, Resource } from '../types';
import { 
  getAllAdminUsernames, 
  createAdmin, 
  changePassword, 
  getCurrentAdminUsername,
  verifyAdmin
} from '../services/authService';
import { getLeads as fetchLeads } from '../services/leadService';
import { getResources, addResource, deleteResource } from '../services/resourceService';
import { Users, TrendingUp, Calendar, Download, Settings, LayoutDashboard, UserPlus, Key, FileUp, Trash2, FileText, FileSpreadsheet, File } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface AdminDashboardProps {
  onChangeView: (view: ViewState) => void;
}

type Tab = 'dashboard' | 'resources' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Resource State
  const [resources, setResources] = useState<Resource[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Settings State
  const [admins, setAdmins] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  
  // Form State
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [changePassVal, setChangePassVal] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  useEffect(() => {
    if (!verifyAdmin()) {
      onChangeView(ViewState.ADMIN_LOGIN);
      return;
    }
    setLeads(fetchLeads());
    setResources(getResources());
    refreshAdminData();
  }, [onChangeView]);

  const refreshAdminData = () => {
    setAdmins(getAllAdminUsernames());
    setCurrentUser(getCurrentAdminUsername() || '');
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminPass) {
      setMsg({ text: 'Please fill all fields', type: 'error' });
      return;
    }
    const success = createAdmin(newAdminName, newAdminPass);
    if (success) {
      setMsg({ text: 'Admin created successfully', type: 'success' });
      setNewAdminName('');
      setNewAdminPass('');
      refreshAdminData();
    } else {
      setMsg({ text: 'Username already exists', type: 'error' });
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePassVal) {
      setMsg({ text: 'Please enter a new password', type: 'error' });
      return;
    }
    const success = changePassword(changePassVal);
    if (success) {
      setMsg({ text: 'Password updated successfully', type: 'success' });
      setChangePassVal('');
    } else {
      setMsg({ text: 'Failed to update password', type: 'error' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
            addResource(file, base64String);
            setResources(getResources());
            setMsg({ text: 'File uploaded successfully', type: 'success' });
        } catch (error) {
            setMsg({ text: 'Error saving file. Storage limit may be reached.', type: 'error' });
        }
        setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteResource = (id: string) => {
    if (window.confirm('Are you sure you want to remove this resource?')) {
        const updatedResources = deleteResource(id);
        setResources([...updatedResources]); // Force new reference
        setMsg({ text: 'Resource deleted successfully', type: 'success' });
    }
  };

  const handleDownloadResource = (resource: Resource) => {
    // Check if it's a real uploaded file (base64) or a mock file
    if (resource.dataUrl && resource.dataUrl !== '#') {
        const link = document.createElement("a");
        link.href = resource.dataUrl;
        link.download = resource.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('This is a demo file (mock data). Please upload a real file to test the download feature.');
    }
  };

  // Process data for the chart (Leads by Revenue Range)
  const chartData = leads.reduce((acc: any[], lead) => {
    const existing = acc.find(item => item.name === lead.revenueRange);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: lead.revenueRange, value: 1 });
    }
    return acc;
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
        case 'excel': return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
        case 'csv': return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
        default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Administrator Portal</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => { setActiveTab('dashboard'); setMsg({ text: '', type: '' }); }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-emerald-50 text-[#70A25B]' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => { setActiveTab('resources'); setMsg({ text: '', type: '' }); }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'resources' 
                    ? 'bg-emerald-50 text-[#70A25B]' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <FileUp className="w-4 h-4 mr-2" />
                Resources
              </button>
              <button
                onClick={() => { setActiveTab('settings'); setMsg({ text: '', type: '' }); }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-emerald-50 text-[#70A25B]' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* NOTIFICATION MESSAGE */}
        {msg.text && (
          <div className={`mb-6 p-4 rounded-lg ${msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {msg.text}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 bg-emerald-50 rounded-lg mr-4">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{leads.length > 0 ? '12.4%' : '0%'}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className="p-3 bg-purple-50 rounded-lg mr-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Submission</p>
                  <p className="text-sm font-bold text-gray-900">
                    {leads.length > 0 ? formatDate(leads[0].timestamp) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Chart */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Demographics by Revenue</h3>
                    <div className="h-64">
                        {leads.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" hide />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#70A25B', '#34D399', '#10B981', '#059669'][index % 4]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                No data available yet
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Recent Submissions</h3>
                        <button className="text-sm text-[#70A25B] hover:underline flex items-center">
                            <Download className="w-4 h-4 mr-1" /> Export CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Revenue</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No leads found. Try submitting the demo form first.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{lead.fullName}</div>
                                                <div className="text-gray-400 text-xs">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{lead.companyName}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {lead.revenueRange}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{formatDate(lead.timestamp)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </>
        )}
        
        {activeTab === 'resources' && (
          <div className="space-y-8">
             <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Upload New Resource</h2>
                <p className="text-gray-500 mb-6">Upload PDF or Excel files to be displayed in the Protected Area.</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#70A25B] transition-colors bg-gray-50">
                   <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      accept=".pdf, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onChange={handleFileUpload}
                   />
                   <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 text-[#70A25B] rounded-full flex items-center justify-center mb-3">
                          <FileUp className="w-6 h-6" />
                      </div>
                      <span className="text-[#70A25B] font-medium hover:underline">Click to upload</span>
                      <span className="text-gray-500 text-sm mt-1">or drag and drop PDF / CSV / Excel</span>
                   </label>
                   {isUploading && <p className="text-sm text-[#70A25B] mt-2 animate-pulse">Uploading...</p>}
                </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Manage Resources</h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {resources.map((resource) => (
                        <div key={resource.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                             <div className="flex items-center">
                                 <div className="p-3 bg-gray-100 rounded-lg mr-4">
                                     {getFileIcon(resource.type)}
                                 </div>
                                 <div>
                                     <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                                     <p className="text-xs text-gray-500">{resource.size} • {new Date(resource.uploadDate).toLocaleDateString()}</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-1">
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleDownloadResource(resource); }}
                                    className="text-gray-400 hover:text-[#70A25B] p-2 rounded-full hover:bg-green-50 transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteResource(resource.id); }}
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                             </div>
                        </div>
                    ))}
                    {resources.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No resources uploaded yet.</div>
                    )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          /* SETTINGS TAB */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Change Password */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <Key className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">My Password</h2>
                  <p className="text-sm text-gray-500">Update your access credentials</p>
                </div>
              </div>
              
              <form onSubmit={handleChangePassword}>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Changing password for user: <span className="font-semibold text-gray-900">{currentUser}</span>
                  </p>
                  <Input
                    label="New Password"
                    type="password"
                    value={changePassVal}
                    onChange={(e) => setChangePassVal(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <Button type="submit" variant="primary">Update Password</Button>
              </form>
            </div>

            {/* Add New Admin */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Create Admin Profile</h2>
                  <p className="text-sm text-gray-500">Add a new team member with admin access</p>
                </div>
              </div>

              <form onSubmit={handleCreateAdmin}>
                <Input
                  label="Username"
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="New admin username"
                />
                <Input
                  label="Initial Password"
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="Set password"
                />
                <Button type="submit" variant="outline" className="mt-2">Create Profile</Button>
              </form>
            </div>

            {/* List Admins */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
               <h3 className="text-lg font-bold text-gray-900 mb-4">Active Admin Profiles</h3>
               <div className="flex flex-wrap gap-3">
                 {admins.map(admin => (
                   <div key={admin} className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                     <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                     <span className="font-medium text-gray-700">{admin}</span>
                     {admin === currentUser && <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">You</span>}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
