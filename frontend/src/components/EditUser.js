import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false,
    is_blocked: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Fetch the user data from the backend
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data.');
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const validateForm = () => {
    if (user.username.length < 3) {
      setFormError('Username must be at least 3 characters long.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    if (user.password && user.password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const updateData = {
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_blocked: user.is_blocked,
      };
      if (user.password) {
        updateData.password = user.password;
      }

      await axios.put(`http://localhost:5001/api/users/${id}`, updateData);
      setSuccess('User updated successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        <span className="ml-3 text-xl">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-4">Edit User</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4"
      >
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            value={user.password || ''}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Leave blank to keep current password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter a new password to update it. Leave blank to keep the current password.
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={user.is_admin}
            onChange={(e) => setUser({ ...user, is_admin: e.target.checked })}
            className="mr-2 form-checkbox text-blue-500"
          />
          <span className="text-sm">Is Admin</span>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={user.is_blocked}
            onChange={(e) => setUser({ ...user, is_blocked: e.target.checked })}
            className="mr-2 form-checkbox text-red-500"
          />
          <span className="text-sm">Is Blocked</span>
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
