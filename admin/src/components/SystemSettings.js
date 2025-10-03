import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Cog6ToothIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  BellIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const SystemSettings = () => {
  const { API_BASE_URL } = useAuth();
  const [settings, setSettings] = useState({
    general: {
      platformName: 'DonateTrack',
      platformDescription: 'Transparent donation platform',
      maintenanceMode: false,
      registrationEnabled: true,
      contactEmail: 'admin@donatetrack.com'
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorRequired: false
    },
    donations: {
      minDonationAmount: 1,
      maxDonationAmount: 10000,
      defaultCurrency: 'INR',
      taxDeductibleThreshold: 250,
      processingFee: 2.9
    }
  });

  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Mock save - replace with actual API call
      setTimeout(() => {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
      setLoading(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const sections = [
    { id: 'general', label: 'General', icon: GlobeAltIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'donations', label: 'Donations', icon: CurrencyDollarIcon }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform Name
        </label>
        <input
          type="text"
          value={settings.general.platformName}
          onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform Description
        </label>
        <textarea
          value={settings.general.platformDescription}
          onChange={(e) => updateSetting('general', 'platformDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Email
        </label>
        <input
          type="email"
          value={settings.general.contactEmail}
          onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.general.maintenanceMode}
            onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Maintenance Mode</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.general.registrationEnabled}
            onChange={(e) => updateSetting('general', 'registrationEnabled', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Registration Enabled</span>
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
            min="6"
            max="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.requireSpecialChars}
            onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Require Special Characters in Passwords</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.twoFactorRequired}
            onChange={(e) => updateSetting('security', 'twoFactorRequired', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Require Two-Factor Authentication</span>
        </label>
      </div>
    </div>
  );

  const renderDonationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Donation Amount (₹)
          </label>
          <input
            type="number"
            value={settings.donations.minDonationAmount}
            onChange={(e) => updateSetting('donations', 'minDonationAmount', parseFloat(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Donation Amount (₹)
          </label>
          <input
            type="number"
            value={settings.donations.maxDonationAmount}
            onChange={(e) => updateSetting('donations', 'maxDonationAmount', parseFloat(e.target.value))}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Currency
        </label>
        <select
          value={settings.donations.defaultCurrency}
          onChange={(e) => updateSetting('donations', 'defaultCurrency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="INR">INR - Indian Rupee</option>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
        </select>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'donations':
        return renderDonationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
          </div>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 pr-6">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6">
          <div className="max-w-4xl">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              {sections.find(s => s.id === activeSection)?.label} Settings
            </h3>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;