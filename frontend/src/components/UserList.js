import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaLock, FaUnlock, FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');  // Start with 'desc' for newest first
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // When `users` or `sortOrder` changes, re-sort the users
    const sorted = [...users].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredUsers(sorted);
  }, [users, sortOrder]);  // Re-run when users or sortOrder changes

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');  // Toggle sorting order
  };

  const handleBlockUnblock = async (userId, isBlocked) => {
    try {
      const updatedStatus = !isBlocked;
      await axios.put(`http://localhost:5001/api/users/${userId}`, {
        is_blocked: updatedStatus,
      });
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_blocked: updatedStatus } : user
        )
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_blocked: updatedStatus } : user
        )
      );
    } catch (error) {
      console.error('Error blocking/unblocking user', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const handleBulkAction = async (action) => {
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          axios.put(`http://localhost:5001/api/users/${userId}`, {
            is_blocked: action === 'block',
          })
        )
      );
      fetchUsers(); // Refresh user list after action
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error in bulk action', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          axios.delete(`http://localhost:5001/api/users/${userId}`)
        )
      );
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error deleting users', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-4xl font-semibold mb-6">User Management</h2>

      {/* Toolbar */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleBulkAction('block')}
          className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white disabled:opacity-50"
          disabled={selectedUsers.length === 0}
        >
          <FaLock className="mr-2" /> Block
        </button>
        <button
          onClick={() => handleBulkAction('unblock')}
          className="flex items-center px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white disabled:opacity-50"
          disabled={selectedUsers.length === 0}
        >
          <FaUnlock className="mr-2" /> Unblock
        </button>
        <button
          onClick={handleBulkDelete}
          className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white disabled:opacity-50"
          disabled={selectedUsers.length === 0}
        >
          <FaTrash className="mr-2" /> Delete
        </button>
        <button
          onClick={() => navigate('/add')}
          className="flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white"
        >
          <FaPlus className="mr-2" /> Add User
        </button>
      </div>

      {/* Filter Input */}
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Search by name..."
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full table-auto bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length}
                  onChange={handleSelectAll}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
              </th>
              
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th
                className="p-3 cursor-pointer"
                onClick={handleSort}
              >
                Created At {sortOrder === 'asc' ? '▲' : '▼'}
              </th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                </td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="border px-4 py-2">
                  {user.created_at ? format(new Date(user.created_at), 'PPPpp') : 'N/A'}
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      user.is_blocked
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                    onClick={() => handleBlockUnblock(user.id, user.is_blocked)}
                  >
                    {user.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                    onClick={() => navigate(`/edit/${user.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
