import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import axiosInstance from '../../../axios';

// const buildImageUrl = (publicId) => {
//   const cloudName = "djy2jlthj";
//   return `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto,w_600/${publicId}`;
// };

// const getImageUrl = (input) => {
//   // Regular expression to check if input is a URL
//   const urlRegex = /^(https?:\/\/)/;

//   // If input matches a URL pattern, return it directly; otherwise, treat it as a public ID
//   if (urlRegex.test(input)) {
//     return input; // Input is a full URL
//   } else {
//     return buildImageUrl(input); // Input is a public ID
//   }
// };

// Separate form component with memoization
const RedAnnouncementsForm = React.memo(({ onSubmit, initialData, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    link: ''
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        link: ''
      });
    }
  }, [initialData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('link', formData.link);
    
    if (isEditing) {
      formDataToSend.append('id', initialData.id);
    }

    onSubmit(formDataToSend);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h3 className="text-lg font-semibold">
        {isEditing ? 'Edit Annoucement' : 'Add New Annoucement'}
      </h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Update Annoucement' : 'Add Annoucement'}
          </button>
        </div>
      </form>
    </div>
  );
});

const RedAnnouncementsList = React.memo(({ 
  redAnnouncementsList, 
  searchTerm, 
  onEdit, 
  onDelete 
}) => (
  <table className="min-w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"> Link</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {redAnnouncementsList.map((RedAnnouncements) => (
        <tr key={RedAnnouncements.id}>
          <td className="px-6 py-4">{RedAnnouncements.id}</td>
          <td className="px-6 py-4">{RedAnnouncements.title}</td>
          <td className="px-6 py-4">{RedAnnouncements.link}</td>
          
          <td className="px-6 py-4">
            {new Date(RedAnnouncements.createdAt).toLocaleDateString()}
          </td>
          <td className="px-6 py-4">
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(RedAnnouncements)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(RedAnnouncements.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
      {redAnnouncementsList.length === 0 && (
        <tr>
          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
            No Annoucement found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
));

const RedAnnouncementsManager = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [redAnnouncementsList, setRedAnnouncementsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRedAnnouncements, setEditingRedAnnouncements] = useState(null);

  const fetchRedAnnouncements = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/RedAnnouncements/RedAnnouncements');
      setRedAnnouncementsList(response.data);
    } catch (error) {
      console.error('Error fetching Annoucement:', error);
    }
  }, []);

  useEffect(() => {
    fetchRedAnnouncements();
  }, [fetchRedAnnouncements]);

  const handleAddRedAnnouncements = async (formData) => {
    try {
      const response = await axiosInstance.post('/RedAnnouncements/RedAnnouncements', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
     } );
      if (response.status === 201) {
        await fetchRedAnnouncements();
        setActiveTab('manage');
        alert("Annoucement added successfully!");
      }
    } catch (error) {
      console.error('Error adding Annoucement:', error);
      alert("Failed to add Annoucement.");
    }
  };

  const handleUpdateRedAnnouncements = async (formData) => {
    try {
      const response = await axiosInstance.put(`/RedAnnouncements/RedAnnouncements/${editingRedAnnouncements.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        await fetchRedAnnouncements();
        setEditingRedAnnouncements(null);
        setActiveTab('manage');
        alert("Annoucement updated successfully!");
      }
    } catch (error) {
      console.error('Error updating Annoucement:', error);
      alert("Failed to update Annoucement.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Annoucement?')) {
      try {
        const response = await axiosInstance.delete(`/RedAnnouncements/RedAnnouncements/${id}`);
        if (response.status === 200) {
          await fetchRedAnnouncements();
          alert("Annoucement deleted successfully!");
        }
      } catch (error) {
        console.error('Error deleting Annoucement:', error);
        alert("Failed to delete Annoucement.");
      }
    }
  };

  const handleEdit = useCallback((RedAnnouncements) => {
    setEditingRedAnnouncements(RedAnnouncements);
    setActiveTab('add');
  }, []);

  const filteredRedAnnouncements = useMemo(() => 
    redAnnouncementsList.filter(RedAnnouncements => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        RedAnnouncements.id.toString().includes(searchTermLower) ||
        RedAnnouncements.title.toLowerCase().includes(searchTermLower)
      );
    }), [redAnnouncementsList, searchTerm]
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setActiveTab('add');
            if (!editingRedAnnouncements) {
              setEditingRedAnnouncements(null);
            }
          }}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'add'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {editingRedAnnouncements ? 'Edit Annoucement' : 'Add Annoucement'}
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'manage'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Manage Annoucements
        </button>
      </div>

      {activeTab === 'add' ? (
        <RedAnnouncementsForm
          onSubmit={editingRedAnnouncements ? handleUpdateRedAnnouncements : handleAddRedAnnouncements}
          initialData={editingRedAnnouncements}
          // initialData={editingRedAnnouncements ? {
          //   title: editingRedAnnouncements.title,
          //   excerpt: editingRedAnnouncements.excerpt,
          //   content: editingRedAnnouncements.content,
          //   image_url: editingRedAnnouncements.image_url || '',
          //   link: editingRedAnnouncements.link,
          // } : null}
          isEditing={!!editingRedAnnouncements}
          onCancel={() => {
            setEditingRedAnnouncements(null);
            setActiveTab('manage');
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Annoucements</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Annoucements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <RedAnnouncementsList 
              redAnnouncementsList={filteredRedAnnouncements}
              searchTerm={searchTerm}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RedAnnouncementsManager;