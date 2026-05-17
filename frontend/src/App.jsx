import { BrowserRouter } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import Navbar from './components/Layout/Navbar.jsx';

const AppContent = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const listener = () => toggleTheme();
    window.addEventListener('toggle-theme', listener);
    return () => window.removeEventListener('toggle-theme', listener);
  }, [toggleTheme]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AppRoutesWithChrome user={user} onLogout={logout} />
    </div>
  );
};

const AppRoutesWithChrome = ({ user, onLogout }) => {
  const pathname = window.location.pathname;

  if (pathname === '/login') {
    return <AppRoutes />;
  }

  return (
    <>
      <Navbar user={user} onLogout={onLogout} notifications={[]} />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-full grid-cols-1 gap-0 lg:grid-cols-[18rem_1fr]">
        {user && <Sidebar user={user} />}
        <main className="border-t border-slate-200 bg-slate-50 p-0 dark:border-slate-800 dark:bg-slate-950">
          <AppRoutes />
        </main>
      </div>
    </>
  );
};



const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
