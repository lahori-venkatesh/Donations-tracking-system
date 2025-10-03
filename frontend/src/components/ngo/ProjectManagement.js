import React, { useState } from 'react';

const ProjectManagement = ({ project, onUpdate, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [projectData, setProjectData] = useState(project);
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'details', label: 'Project Details', icon: 'M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709' },
    { id: 'updates', label: 'Progress Updates', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'donations', label: 'Donations', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2' },
    { id: 'transparency', label: 'Transparency', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857' }
  ];

  const handleSave = () => {
    onUpdate(projectData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <p className="text-gray-600">Project Management Dashboard</p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="btn-primary">Save Changes</button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="btn-primary">Edit Project</button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'details' && (
            <ProjectDetailsTab 
              project={projectData} 
              isEditing={isEditing}
              onChange={setProjectData}
            />
          )}
          {activeTab === 'updates' && <ProgressUpdatesTab project={project} />}
          {activeTab === 'donations' && <ProjectDonationsTab project={project} />}
          {activeTab === 'transparency' && <ProjectTransparencyTab project={project} />}
          {activeTab === 'beneficiaries' && <ProjectBeneficiariesTab project={project} />}
        </div>
      </div>
    </div>
  );
};

const ProjectDetailsTab = ({ project, isEditing, onChange }) => (
  <div className="space-y-6">
    {/* Project Overview */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
        {isEditing ? (
          <input
            type="text"
            value={project.name}
            onChange={(e) => onChange({...project, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        ) : (
          <p className="text-gray-900 font-medium">{project.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        {isEditing ? (
          <select
            value={project.category}
            onChange={(e) => onChange({...project, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="water">Clean Water</option>
            <option value="education">Education</option>
            <option value="food">Food Relief</option>
            <option value="medical">Healthcare</option>
            <option value="shelter">Shelter</option>
          </select>
        ) : (
          <p className="text-gray-900 font-medium capitalize">{project.category}</p>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
      {isEditing ? (
        <textarea
          rows={4}
          value={project.description}
          onChange={(e) => onChange({...project, description: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      ) : (
        <p className="text-gray-900">{project.description}</p>
      )}
    </div>

    {/* Financial Information */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-600">₹{project.raisedAmount?.toLocaleString()}</div>
        <div className="text-sm text-green-700">Amount Raised</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-600">₹{project.targetAmount?.toLocaleString()}</div>
        <div className="text-sm text-blue-700">Target Amount</div>
      </div>
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-purple-600">{project.donorsCount}</div>
        <div className="text-sm text-purple-700">Total Donors</div>
      </div>
    </div>

    {/* Progress Bar */}
    <div>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{Math.round((project.raisedAmount / project.targetAmount) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${Math.min((project.raisedAmount / project.targetAmount) * 100, 100)}%` }}
        ></div>
      </div>
    </div>

    {/* Additional Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        {isEditing ? (
          <input
            type="text"
            value={project.location}
            onChange={(e) => onChange({...project, location: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        ) : (
          <p className="text-gray-900">{project.location}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Beneficiaries</label>
        {isEditing ? (
          <input
            type="number"
            value={project.beneficiaries}
            onChange={(e) => onChange({...project, beneficiaries: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        ) : (
          <p className="text-gray-900">{project.beneficiaries} people</p>
        )}
      </div>
    </div>
  </div>
);

const ProgressUpdatesTab = ({ project }) => {
  const [updates, setUpdates] = useState([
    {
      id: 1,
      title: 'Project Initiated',
      description: 'Site survey completed and community meetings conducted',
      date: '2024-01-15',
      status: 'completed',
      photos: ['survey1.jpg', 'meeting1.jpg'],
      expenditure: 5000
    },
    {
      id: 2,
      title: 'Equipment Procurement',
      description: 'Solar water pumps and filtration systems purchased',
      date: '2024-01-20',
      status: 'completed',
      photos: ['equipment1.jpg'],
      expenditure: 25000
    }
  ]);

  const [showAddUpdate, setShowAddUpdate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Progress Updates</h3>
        <button
          onClick={() => setShowAddUpdate(true)}
          className="btn-primary"
        >
          Add Update
        </button>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{update.title}</h4>
                <p className="text-sm text-gray-600">{update.description}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  update.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {update.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">{new Date(update.date).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Expenditure: ₹{update.expenditure.toLocaleString()}</span>
              <span>{update.photos.length} photos attached</span>
            </div>
          </div>
        ))}
      </div>

      {showAddUpdate && (
        <AddUpdateModal 
          onClose={() => setShowAddUpdate(false)}
          onSubmit={(updateData) => {
            setUpdates([...updates, { ...updateData, id: Date.now() }]);
            setShowAddUpdate(false);
          }}
        />
      )}
    </div>
  );
};

const ProjectDonationsTab = ({ project }) => {
  const donations = [
    {
      id: 1,
      donor: 'Rajesh Kumar',
      amount: 5000,
      date: '2024-01-15',
      status: 'completed',
      anonymous: false
    },
    {
      id: 2,
      donor: 'Anonymous',
      amount: 3000,
      date: '2024-01-20',
      status: 'completed',
      anonymous: true
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {donation.anonymous ? 'Anonymous Donor' : donation.donor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                  ₹{donation.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(donation.date).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {donation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProjectTransparencyTab = ({ project }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900">Transparency Documentation</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card">
        <h4 className="font-medium text-gray-900 mb-4">Upload Receipts</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-gray-600 mb-2">Upload receipts and invoices</p>
          <button className="btn-primary">Choose Files</button>
        </div>
      </div>

      <div className="card">
        <h4 className="font-medium text-gray-900 mb-4">Upload Impact Photos</h4>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 mb-2">Upload before/after photos</p>
          <button className="btn-primary">Choose Photos</button>
        </div>
      </div>
    </div>
  </div>
);

const ProjectBeneficiariesTab = ({ project }) => {
  const beneficiaries = [
    {
      id: 1,
      name: 'Lakshmi Devi',
      age: 45,
      location: 'Thanjavur, Tamil Nadu',
      status: 'Active',
      impact: 'Access to clean water for family of 5'
    },
    {
      id: 2,
      name: 'Murugan',
      age: 38,
      location: 'Madurai, Tamil Nadu',
      status: 'Active',
      impact: 'Clean water access for community of 50 families'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Project Beneficiaries</h3>
        <button className="btn-primary">Add Beneficiary</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {beneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="card">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {beneficiary.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{beneficiary.name}</h4>
                <p className="text-sm text-gray-600">Age: {beneficiary.age}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{beneficiary.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {beneficiary.status}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-700">{beneficiary.impact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddUpdateModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expenditure: '',
    status: 'in-progress'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date().toISOString().split('T')[0],
      expenditure: parseFloat(formData.expenditure),
      photos: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add Progress Update</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Equipment Installation Completed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the progress made..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expenditure (₹)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.expenditure}
              onChange={(e) => setFormData({...formData, expenditure: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              Add Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectManagement;