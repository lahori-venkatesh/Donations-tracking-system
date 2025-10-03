import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProjectManagement = () => {
  const { API_BASE_URL } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    loadProjects();
  }, [selectedStatus, selectedCategory, searchTerm]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockProjects = [
        {
          id: '1',
          name: 'Clean Water Initiative',
          ngo: {
            id: '2',
            name: 'Hope Foundation',
            organization: 'Hope Foundation'
          },
          description: 'Providing clean drinking water to rural communities through well construction and water purification systems.',
          category: 'water',
          targetAmount: 50000,
          currentAmount: 32000,
          status: 'active',
          location: 'Rural Tamil Nadu',
          createdAt: '2024-01-01',
          endDate: '2024-03-15',
          donationsCount: 24,
          beneficiariesCount: 200,
          urgency: 'high',
          verificationStatus: 'verified',
          fraudRiskScore: 15
        },
        {
          id: '2',
          name: 'Education for All',
          ngo: {
            id: '3',
            name: 'Learning Bridge',
            organization: 'Learning Bridge NGO'
          },
          description: 'Building schools and providing educational materials for underprivileged children.',
          category: 'education',
          targetAmount: 80000,
          currentAmount: 65000,
          status: 'active',
          location: 'Rural India',
          createdAt: '2024-01-05',
          endDate: '2024-04-20',
          donationsCount: 45,
          beneficiariesCount: 150,
          urgency: 'medium',
          verificationStatus: 'pending',
          fraudRiskScore: 25
        }
      ];

      setTimeout(() => {
        setProjects(mockProjects);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
  };

  const handleProjectAction = (project, action) => {
    setSelectedProject(project);
    setActionType(action);
    setShowProjectModal(true);
  };

  const executeProjectAction = async () => {
    try {
      console.log(`Executing ${actionType} for project:`, selectedProject.id);
      
      if (actionType === 'approve') {
        setProjects(projects.map(project => 
          project.id === selectedProject.id 
            ? { ...project, verificationStatus: 'verified' }
            : project
        ));
      } else if (actionType === 'reject') {
        setProjects(projects.map(project => 
          project.id === selectedProject.id 
            ? { ...project, verificationStatus: 'rejected', status: 'suspended' }
            : project
        ));
      }

      setShowProjectModal(false);
      setSelectedProject(null);
      setActionType('');
    } catch (error) {
      console.error('Error executing project action:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600 mt-1">Monitor and manage all projects on the platform</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Export Projects
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects by name, NGO, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="suspended">Suspended</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {project.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">NGO:</span>
                      <p className="font-medium">{project.ngo.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <p className="font-medium">₹{project.targetAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Raised:</span>
                      <p className="font-medium">₹{project.currentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <p className="font-medium">{Math.round((project.currentAmount / project.targetAmount) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleProjectAction(project, 'view')}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  View Details
                </button>
                {project.verificationStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleProjectAction(project, 'approve')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleProjectAction(project, 'reject')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'view' ? 'Project Details' : 
               actionType === 'approve' ? 'Approve Project' : 'Reject Project'}
            </h3>
            
            {actionType === 'view' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <p className="text-sm text-gray-900">{selectedProject?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedProject?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Target Amount</label>
                    <p className="text-sm text-gray-900">₹{selectedProject?.targetAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Amount</label>
                    <p className="text-sm text-gray-900">₹{selectedProject?.currentAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">
                Are you sure you want to {actionType} project "{selectedProject?.name}"?
              </p>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {actionType === 'view' ? 'Close' : 'Cancel'}
              </button>
              {actionType !== 'view' && (
                <button
                  onClick={executeProjectAction}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    actionType === 'reject'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;