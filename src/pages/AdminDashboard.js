// src/pages/AdminDashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import Sidebar from '../components/Sidebar';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [programsCount, setProgramsCount] = useState(0);
  const [liveUsersCount, setLiveUsersCount] = useState(0);

  useOnlineStatus(); // Custom hook

  const fetchAdminInfo = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setAdminInfo(data);
    }
  }, []);

  const fetchLiveUsers = useCallback(async () => {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'online');
    setLiveUsersCount(count || 0);
  }, []);

  const fetchCounts = useCallback(async () => {
    const [{ count: users }, { count: staff }, { count: programs }] =
      await Promise.all([
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'user'),
        supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'staff'),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
      ]);

    setUsersCount(users || 0);
    setStaffCount(staff || 0);
    setProgramsCount(programs || 0);
    fetchLiveUsers();
  }, [fetchLiveUsers]);

  useEffect(() => {
    fetchAdminInfo();
    fetchCounts();

    const subscription = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.new?.status || payload.old?.status) {
            fetchLiveUsers();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAdminInfo, fetchCounts, fetchLiveUsers]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="welcome-header">
          <h1>
            Welcome, {adminInfo?.full_name || 'Admin'}!
            <span className="wave" role="img" aria-label="waving hand">👋</span>
          </h1>
          {adminInfo?.email && (
            <p style={{ color: '#555', fontSize: '0.9rem' }}>
              Logged in as: {adminInfo.email}
            </p>
          )}
        </div>

        <div className="card-grid">
          <div className="card">
            <div className="card-icon users">👥</div>
            <h3>Total Users</h3>
            <p>{usersCount}</p>
          </div>
          <div className="card">
            <div className="card-icon staff">🧑‍💼</div>
            <h3>Total Staff</h3>
            <p>{staffCount}</p>
          </div>
          <div className="card">
            <div className="card-icon programs">📚</div>
            <h3>Total Programs</h3>
            <p>{programsCount}</p>
          </div>
          <div className="card">
            <div className="card-icon live">🟢</div>
            <h3>Live Users</h3>
            <p>{liveUsersCount}</p>
          </div>
        </div>
      </div>

      {/* Moved styles outside of return */}
      <style>{`
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
          font-family: 'Roboto', sans-serif;
        }
        .welcome-header h1 {
          font-size: 2.25rem;
          font-weight: 600;
          color: #1a237e;
        }
        .wave {
          display: inline-block;
          margin-left: 10px;
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
        }
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        .card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
        }
        .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .card-icon.users { color: #1976d2; }
        .card-icon.staff { color: #388e3c; }
        .card-icon.programs { color: #f57c00; }
        .card-icon.live { color: #d32f2f; }
        .card h3 {
          margin-bottom: 0.75rem;
          color: #3f51b5;
          font-size: 1.1rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card p {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
