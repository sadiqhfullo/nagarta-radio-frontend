import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';

const PAGE_SIZE = 10;

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const observer = useRef(null);
  const loadMoreRef = useRef(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'staff')
      .order(sortKey, { ascending: sortOrder === 'asc' })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching staff:', error.message);
      setLoading(false);
      return;
    }

    if (data) {
      // prevent duplicates when refetching after sort
      setStaff((prev) => {
        const ids = new Set(prev.map(s => s.id));
        const newStaff = data.filter(s => !ids.has(s.id));
        return [...prev, ...newStaff];
      });
      if (data.length < PAGE_SIZE) setHasMore(false);
    }

    setLoading(false);
  }, [page, sortKey, sortOrder]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);
  }, [loading, hasMore]);

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder((prev) => (sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'));
    setStaff([]);
    setPage(1);
    setHasMore(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this staff member?');
    if (!confirmed) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error.message);
      alert('Failed to delete staff.');
    } else {
      alert('Staff deleted.');
      setStaff(prev => prev.filter(s => s.id !== id));
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
            color: #333;
            font-family: 'Segoe UI', Roboto, sans-serif;
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
            transition: background-color 0.3s ease;
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
              position: absolute;
              top: -9999px;
              left: -9999px;
            }

            tr {
              margin-bottom: 1rem;
              border: 1px solid #ccc;
              border-radius: 8px;
              padding: 1rem;
              background-color: #fff;
            }

            td {
              border: none;
              position: relative;
              padding-left: 50%;
            }

            td::before {
              position: absolute;
              top: 0;
              left: 1rem;
              width: 45%;
              padding-right: 1rem;
              white-space: nowrap;
              font-weight: bold;
            }

            td:nth-of-type(1)::before { content: "Full Name"; }
            td:nth-of-type(2)::before { content: "Email"; }
            td:nth-of-type(3)::before { content: "Role"; }
            td:nth-of-type(4)::before { content: "Date Joined"; }
            td:nth-of-type(5)::before { content: "Actions"; }
          }
        `}</style>

        <h2>Manage Staff</h2>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('full_name')}>
                Full Name {sortKey === 'full_name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('email')}>
                Email {sortKey === 'email' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('role')}>
                Role {sortKey === 'role' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={() => handleSort('created_at')}>
                Date Joined {sortKey === 'created_at' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id}>
                <td>{s.full_name}</td>
                <td>{s.email}</td>
                <td>{s.role}</td>
                <td>{new Date(s.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={loadMoreRef} style={{ height: '20px' }}></div>
        {loading && <p>Loading more staff...</p>}
        {!hasMore && <p>No more staff to load.</p>}
      </div>
    </div>
  );
};

export default ManageStaff;
