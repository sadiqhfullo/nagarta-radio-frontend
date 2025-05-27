import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';

const PAGE_SIZE = 10;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const observer = useRef(null);
  const loadMoreRef = useRef(null);
  const seenUserIds = useRef(new Set());

  const fetchUsers = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user')
      .order(sortKey, { ascending: sortOrder === 'asc' })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching users:', error.message);
    } else if (data) {
      const newUsers = data.filter(user => !seenUserIds.current.has(user.id));
      newUsers.forEach(user => seenUserIds.current.add(user.id));
      setUsers(prev => [...prev, ...newUsers]);
      if (data.length < PAGE_SIZE) setHasMore(false);
    }

    setLoading(false);
  }, [page, sortKey, sortOrder, loading, hasMore]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);
  }, [hasMore, loading]);

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(prev => (key === sortKey && prev === 'asc' ? 'desc' : 'asc'));
    setUsers([]);
    seenUserIds.current.clear();
    setPage(1);
    setHasMore(true);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error.message);
      alert('Failed to delete user.');
    } else {
      alert('User deleted successfully.');
      setUsers(prev => prev.filter(user => user.id !== userId));
      seenUserIds.current.delete(userId);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <style jsx>{`
          .dashboard-layout {
            display: flex;
            background-color: #f0f2f5;
            min-height: 100vh;
          }
          .main-content {
            flex-grow: 1;
            margin-left: 250px;
            padding: 2rem;
            font-family: 'Roboto', 'Segoe UI', sans-serif;
            color: #333;
          }
          h2 {
            font-size: 2rem;
            font-weight: 600;
            color: #1a237e;
            margin-bottom: 1.5rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
          }
          th {
            background-color: #f5f5f5;
            cursor: pointer;
            user-select: none;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
          .delete-button {
            background-color: #d32f2f;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
          }
          .delete-button:hover {
            background-color: #b71c1c;
          }
          @media (max-width: 768px) {
            .main-content {
              margin-left: 0;
              padding: 1rem;
            }
            table, thead, tbody, th, td, tr {
              display: block;
            }
            th {
              display: none;
            }
            tr {
              margin-bottom: 1rem;
              border: 1px solid #ccc;
              border-radius: 8px;
              padding: 1rem;
              background-color: #fff;
            }
            td {
              position: relative;
              padding-left: 50%;
              border: none;
            }
            td::before {
              position: absolute;
              top: 0;
              left: 1rem;
              font-weight: bold;
              width: 45%;
              white-space: nowrap;
            }
            td:nth-of-type(1)::before { content: "Full Name"; }
            td:nth-of-type(2)::before { content: "Email"; }
            td:nth-of-type(3)::before { content: "Role"; }
            td:nth-of-type(4)::before { content: "Date Joined"; }
            td:nth-of-type(5)::before { content: "Actions"; }
          }
        `}</style>

        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('full_name')}>Full Name {sortKey === 'full_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('email')}>Email {sortKey === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('role')}>Role {sortKey === 'role' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('created_at')}>Date Joined {sortKey === 'created_at' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={loadMoreRef} style={{ height: '20px' }}></div>
        {loading && <p>Loading more users...</p>}
        {!hasMore && <p>No more users to load.</p>}
      </div>
    </div>
  );
};

export default ManageUsers;
