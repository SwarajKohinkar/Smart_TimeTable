import React, { useState, useEffect } from 'react';

const AddDivision = () => {
  const [divisionName, setDivisionName] = useState('');
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch divisions from backend
  const fetchDivisions = async () => {
    try {
      const response = await fetch('/api/divisions');
      if (response.ok) {
        const data = await response.json();
        setDivisions(data);
      } else {
        console.log('Error fetching divisions:', response.statusText);
      }
    } catch (error) {
      console.log('Error fetching divisions:', error);
    }
  };

  // Fetch divisions on component mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  // Handle form submission
  const handleAddDivision = async (e) => {
    e.preventDefault();
    
    if (!divisionName.trim()) {
      alert('Please enter a division name');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/divisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: divisionName
        }),
      });

      if (response.ok) {
        const newDivision = await response.json();
        console.log('Division added successfully:', newDivision);
        
        // Clear the input field
        setDivisionName('');
        
        // Fetch updated divisions list from backend
        await fetchDivisions();
        
        alert('Division added successfully!');
      } else {
        const errorData = await response.json();
        console.log('Error adding division:', errorData);
        alert('Failed to add division: ' + (errorData.detail || 'Unknown error'));
      }
    } catch (error) {
      console.log('Error adding division:', error);
      alert('Failed to add division. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete division (optional feature)
  const handleDeleteDivision = async (divisionId) => {
    if (!window.confirm('Are you sure you want to delete this division?')) {
      return;
    }

    try {
      const response = await fetch(`/api/divisions/${divisionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Division deleted successfully');
        await fetchDivisions();
      } else {
        console.log('Error deleting division:', response.statusText);
      }
    } catch (error) {
      console.log('Error deleting division:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Divisions</h2>
      
      {/* Add Division Form */}
      <form onSubmit={handleAddDivision} className="mb-8">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="divisionName" className="block text-sm font-medium text-gray-700 mb-2">
              Division Name
            </label>
            <input
              type="text"
              id="divisionName"
              value={divisionName}
              onChange={(e) => setDivisionName(e.target.value)}
              placeholder="Enter division name (e.g., A, B, C)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add Division'}
          </button>
        </div>
      </form>

      {/* Divisions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Division Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {divisions.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No divisions added yet
                </td>
              </tr>
            ) : (
              divisions.map((division) => (
                <tr key={division.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {division.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {division.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteDivision(division.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddDivision;
