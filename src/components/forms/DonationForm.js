import React, { useState } from 'react';
import { mockProjects } from '../../services/mockData';

const DonationForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    amount: '',
    purpose: '',
    message: '',
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleAmountSelect = (amount) => {
    setFormData({
      ...formData,
      amount: amount.toString(),
    });
    if (errors.amount) {
      setErrors({
        ...errors,
        amount: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid donation amount';
    } else if (parseFloat(formData.amount) < 100) {
      newErrors.amount = 'Minimum donation amount is ₹100';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please specify the purpose of your donation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newDonation = {
        id: Date.now().toString(),
        donorId: '1', // Mock donor ID
        projectId: formData.projectId,
        amount: parseFloat(formData.amount),
        currency: 'INR',
        status: 'pending',
        purpose: formData.purpose,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
        transactionId: `TXN${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setLoading(false);
      onSuccess(newDonation);
      onClose();
      
      // Show success message
      alert(`Thank you for your donation of ₹${formData.amount}! Your contribution will make a real difference.`);
    }, 2000);
  };

  const selectedProject = mockProjects.find(p => p.id === formData.projectId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Make a Donation</h2>
          <p className="text-gray-600">Support a project and create meaningful impact</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Select Project *
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={`input-field ${errors.projectId ? 'border-red-300 focus:ring-red-500' : ''}`}
              required
            >
              <option value="">Choose a project to support</option>
              {mockProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.location}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="text-red-600 text-sm mt-1">{errors.projectId}</p>}
          </div>

          {/* Project Details */}
          {selectedProject && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedProject.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{selectedProject.description}</p>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>₹{selectedProject.currentAmount.toLocaleString()} raised</span>
                <span>₹{selectedProject.targetAmount.toLocaleString()} goal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((selectedProject.currentAmount / selectedProject.targetAmount) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Predefined Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose an amount *
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.amount === amount.toString()
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-semibold">₹{amount.toLocaleString()}</span>
                </button>
              ))}
            </div>
            
            {/* Custom Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`input-field pl-8 ${errors.amount ? 'border-red-300 focus:ring-red-500' : ''}`}
                  placeholder="0"
                  min="100"
                  required
                />
              </div>
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Donation *
            </label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className={`input-field ${errors.purpose ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="e.g., Water pump installation, School supplies, Medical equipment"
              required
            />
            {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Leave a message of support for the beneficiaries..."
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
              Make this donation anonymous
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                `Donate ₹${formData.amount || '0'}`
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your donation is secure and will be processed safely
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;