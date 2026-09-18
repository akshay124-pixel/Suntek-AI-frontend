import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>⏱️ Task Tracker</h1>
            </div>
            <nav className="nav">
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className="nav-link">
                Tasks
              </NavLink>
              <NavLink to="/time-logs" className="nav-link">
                Time Logs
              </NavLink>
            </nav>
            <div className="header-actions">
              <span className="user-name">👤 {user?.name}</span>
              <button onClick={logout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
