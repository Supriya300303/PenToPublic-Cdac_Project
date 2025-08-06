import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Moon, 
  Sun, 
  UserCheck, 
  UserX,
  BookCheck,
  BarChart3,
  RotateCw,
  AlertCircle,
  Calendar,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Settings
} from 'lucide-react';

// Import adminService (this would be your actual service)
const adminService = {
  getDashboard: () => fetch('/api/admin/dashboard').then(res => res.json()),
  getPendingBooks: () => fetch('/api/admin/pending-books').then(res => res.json()),
  getReaders: () => fetch('/api/admin/readers').then(res => res.json()),
  getAuthors: () => fetch('/api/admin/authors').then(res => res.json()),
  getBooksSummary: () => fetch('/api/admin/books-summary').then(res => res.json()),
  approveBook: (bookId) => fetch(`/api/admin/books/${bookId}/approve`, { method: 'PUT' }).then(res => res.json()),
  rejectBook: (bookId) => fetch(`/api/admin/books/${bookId}/reject`, { method: 'PUT' }).then(res => res.json())
};

// These hooks would be imported from your actual context and router
// import { useAuth } from '@/context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// For demo purposes, these are placeholder functions that simulate the real behavior
const useAuth = () => ({
  user: { userName: "Admin User", role: "administrator" }, // This will be populated by your actual auth context
  logout: () => console.log("Logout function called")
});

const useNavigate = () => (path) => {
  console.log("Navigate to:", path);
  // In your real app, this would actually navigate to the route
  return true;
};

// AdminHeader Component
const AdminHeader = ({ darkMode, onToggleTheme, onRefresh, refreshing }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white dark:bg-brown-700 shadow px-4 py-2 flex items-center justify-between sticky top-0 z-20 border-b border-brown-200 dark:border-brown-600">
      <div className="flex items-center space-x-6">
        <h1
          className="text-2xl font-bold cursor-pointer text-brown-600 dark:text-brown-400"
          onClick={() => navigate("/admin-dashboard")}
        >
          PenToPublic Admin 🛡️
        </h1>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg bg-brown-100 dark:bg-brown-600 hover:bg-brown-200 dark:hover:bg-brown-500 transition-all duration-200 ${refreshing ? 'opacity-50' : ''}`}
          >
            <RotateCw className={`h-4 w-4 text-brown-600 dark:text-brown-300 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-brown-600 dark:text-brown-300 text-sm font-medium hidden sm:block">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-brown-100 dark:bg-brown-600 hover:bg-brown-200 dark:hover:bg-brown-500 transition-all duration-200"
          >
            {darkMode ? <Sun className="h-4 w-4 text-brown-400" /> : <Moon className="h-4 w-4 text-brown-600" />}
          </button>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 border rounded-full px-3 py-2 bg-white dark:bg-brown-800 text-brown-dark dark:text-off-white hover:bg-brown-100 dark:hover:bg-brown-600 transition border-brown-300 dark:border-brown-500"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <User size={18} />
          <span className="font-medium">{user?.userName || 'Admin User'}</span>
          <ChevronDown size={16} />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-brown-700 border border-brown-300 dark:border-brown-500 rounded-lg shadow z-50 overflow-hidden">
              <div className="p-4 border-b border-brown-200 dark:border-brown-600">
                <p className="font-semibold text-brown-dark dark:text-off-white">{user?.userName || 'Admin User'}</p>
                <p className="text-sm text-brown-500 dark:text-brown-300 capitalize">{user?.role || 'Administrator'}</p>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-3 hover:bg-brown-100 dark:hover:bg-brown-600 flex items-center gap-2 text-brown-dark dark:text-off-white"
              >
                <User size={16} className="text-brown-600 dark:text-brown-300" />
                <span>Your Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

const AdminDashboard = () => {
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [booksSummary, setBooksSummary] = useState([]);

  // Theme
  const theme = {
    bg: darkMode ? 'bg-brown-900' : 'bg-off-white-light', // Updated background gradient
    cardBg: darkMode ? 'bg-brown-800/90' : 'bg-white/90 backdrop-blur-sm',
    text: darkMode ? 'text-off-white' : 'text-brown-dark',
    textSecondary: darkMode ? 'text-brown-300' : 'text-brown-600',
    border: darkMode ? 'border-brown-700/50' : 'border-brown-200/50',
    hover: darkMode ? 'hover:bg-brown-700/50' : 'hover:bg-brown-100/70',
    accent: darkMode ? 'bg-brown-700/50' : 'bg-brown-100/50',
    primary: 'bg-gradient-to-r from-brown-500 to-brown-600',
    primaryHover: 'hover:from-brown-600 hover:to-brown-700'
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, pending, readers, authors, summary] = await Promise.allSettled([
        adminService.getDashboard(),
        adminService.getPendingBooks(),
        adminService.getReaders(),
        adminService.getAuthors(),
        adminService.getBooksSummary()
      ]);

      if (dashboard.status === 'fulfilled') {
        setDashboardData(dashboard.value);
      }
      if (pending.status === 'fulfilled') {
        setPendingBooks(pending.value || []);
      }
      if (readers.status === 'fulfilled') {
        setReaders(readers.value || []);
      }
      if (authors.status === 'fulfilled') {
        setAuthors(authors.value || []);
      }
      if (summary.status === 'fulfilled') {
        setBooksSummary(summary.value || []);
      }

      const failures = [dashboard, pending, readers, authors, summary]
        .filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.warn('Some API calls failed:', failures);
        setError(`${failures.length} API endpoints failed to load`);
      }

    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Handle book approval
  const handleApprove = async (bookId) => {
    try {
      await adminService.approveBook(bookId);
      setPendingBooks(prev => prev.filter(book => book.id !== bookId));
      
      if (dashboardData?.books) {
        setDashboardData(prev => ({
          ...prev,
          books: {
            ...prev.books,
            pending: Math.max(0, (prev.books.pending || 0) - 1),
            approved: (prev.books.approved || 0) + 1
          }
        }));
      }
      
      showNotification('Book approved successfully', 'success');
    } catch (error) {
      showNotification('Failed to approve book: ' + error.message, 'error');
    }
  };

  // Handle book rejection
  const handleReject = async (bookId) => {
    try {
      await adminService.rejectBook(bookId);
      setPendingBooks(prev => prev.filter(book => book.id !== bookId));
      
      if (dashboardData?.books) {
        setDashboardData(prev => ({
          ...prev,
          books: {
            ...prev.books,
            pending: Math.max(0, (prev.books.pending || 0) - 1),
            rejected: (prev.books.rejected || 0) + 1
          }
        }));
      }
      
      showNotification('Book rejected successfully', 'success');
    } catch (error) {
      showNotification('Failed to reject book: ' + error.message, 'error');
    }
  };

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Initialize
  useEffect(() => {
    fetchData();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-brown-200 border-t-brown-600 mx-auto mb-6 shadow-lg"></div>
          <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>
            <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
              Loading Admin Dashboard
            </span>
          </h2>
          <p className={`${theme.textSecondary} text-lg`}>Fetching data...</p>
        </div>
        </div>
      );
    }

    // Error screen
    if (error && !dashboardData && pendingBooks.length === 0) {
      return (
        <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
          <div className="text-center max-w-md mx-auto p-8">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
            <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>Connection Failed</h2>
            <p className={`${theme.textSecondary} mb-6 text-lg`}>{error}</p>
            <button
              onClick={fetchData}
              className="bg-gradient-to-r from-brown-600 to-brown-700 text-white px-8 py-3 rounded-xl hover:from-brown-700 hover:to-brown-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // Stats Card Component
    const StatCard = ({ icon: Icon, title, value, color, iconBg }) => (
      <div className={`${theme.cardBg} ${theme.border} rounded-2xl shadow-xl border p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-lg`}>
        <div className="flex items-center space-x-4">
          <div className={`${iconBg} p-3 rounded-xl shadow-lg`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <h3 className={`text-sm font-medium ${theme.textSecondary} uppercase tracking-wide mb-1`}>
              {title}
            </h3>
            <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
              {value !== null && value !== undefined ? value : '-'}
            </p>
          </div>
        </div>
      </div>
    );

    // Navigation Component
    const Navigation = () => (
      <div className={`${theme.cardBg} ${theme.border} rounded-2xl shadow-xl border p-4 mb-6 backdrop-blur-lg`}>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'pending', label: `Pending Books (${pendingBooks.length})`, icon: Clock },
            { id: 'authors', label: `Authors (${authors.length})`, icon: UserCheck },
            { id: 'readers', label: `Readers (${readers.length})`, icon: Users },
            { id: 'summary', label: `Books (${booksSummary.length})`, icon: BookCheck }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? `${theme.primary} text-white shadow-lg transform scale-105` 
                  : `${theme.text} ${theme.hover} shadow-md`
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    );

    // Dashboard Content
    const DashboardContent = () => {
      if (!dashboardData) {
        return (
          <div className={`${theme.cardBg} ${theme.border} rounded-2xl shadow-xl border p-12 text-center backdrop-blur-lg`}>
            <BarChart3 className={`h-20 w-20 ${theme.textSecondary} mx-auto mb-6`} />
            <h3 className={`text-xl font-bold ${theme.text} mb-3`}>No Dashboard Data</h3>
            <p className={`${theme.textSecondary} text-lg`}>Unable to load dashboard statistics</p>
          </div>
        );
      }

      const { books = {}, users = {} } = dashboardData;

      return (
        <div className="space-y-8">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center`}>
              <BookOpen className="h-6 w-6 mr-3 text-brown-600 dark:text-brown-400" />
              <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
                Book Statistics
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={BookOpen} title="Total Books" value={books.total} color="from-blue-600 to-blue-700" iconBg="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900" />
              <StatCard icon={CheckCircle} title="Approved" value={books.approved} color="from-green-600 to-emerald-700" iconBg="bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-800 dark:to-green-900" />
              <StatCard icon={Clock} title="Pending" value={books.pending} color="from-brown-600 to-brown-700" iconBg="bg-gradient-to-br from-brown-100 to-brown-200 dark:from-brown-800 dark:to-brown-900" />
              <StatCard icon={XCircle} title="Rejected" value={books.rejected} color="from-red-600 to-rose-700" iconBg="bg-gradient-to-br from-red-100 to-rose-200 dark:from-red-800 dark:to-red-900" />
            </div>
          </div>

          <div>
            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center`}>
              <Users className="h-6 w-6 mr-3 text-brown-600 dark:text-brown-400" />
              <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
                User Statistics
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={UserCheck} title="Authors" value={users.authors} color="from-brown-600 to-brown-700" iconBg="bg-gradient-to-br from-brown-100 to-brown-200 dark:from-brown-800 dark:to-brown-900" />
              <StatCard icon={Users} title="Readers" value={users.readers} color="from-brown-600 to-brown-700" iconBg="bg-gradient-to-br from-brown-100 to-brown-200 dark:from-brown-800 dark:to-brown-900" />
              <StatCard icon={UserX} title="Subscribed" value={users.subscribedReaders} color="from-brown-600 to-brown-700" iconBg="bg-gradient-to-br from-brown-100 to-brown-200 dark:from-brown-800 dark:to-brown-900" />
            </div>
          </div>
        </div>
      );
    };

    // Pending Books Content
    const PendingBooksContent = () => (
      <div className={`${theme.cardBg} ${theme.border} rounded-2xl shadow-xl border overflow-hidden backdrop-blur-lg`}>
        <div className="px-6 py-5 border-b border-brown-100 dark:border-brown-600 bg-gradient-to-r from-off-white-light to-off-white dark:from-brown-800 dark:to-brown-800">
          <h2 className={`text-2xl font-bold ${theme.text} flex items-center`}>
            <Clock className="h-6 w-6 mr-3 text-brown-600 dark:text-brown-400" />
            <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
              Pending Book Approvals
            </span>
          </h2>
          <p className={`text-sm ${theme.textSecondary} mt-1`}>{pendingBooks.length} books awaiting review</p>
        </div>
        
        {pendingBooks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h3 className={`text-xl font-bold ${theme.text} mb-3`}>All Caught Up!</h3>
            <p className={`${theme.textSecondary} text-lg`}>No pending books to review</p>
          </div>
        ) : (
          <div className={`divide-y ${theme.border}`}>
            {pendingBooks.map((book) => (
              <div key={book.id} className={`p-6 ${theme.hover} transition-all duration-200`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${theme.text} mb-2`}>{book.title}</h3>
                    <p className={`${theme.textSecondary} mb-3 text-lg`}>by {book.author}</p>
                    {book.description && (
                      <p className={`text-sm ${theme.textSecondary} mb-4 leading-relaxed`}>{book.description}</p>
                    )}
                    <div className="flex items-center space-x-4">
                      {book.category && (
                        <span className="px-4 py-2 bg-gradient-to-r from-brown-500 to-brown-600 text-white text-xs rounded-full font-semibold shadow-md">
                          {book.category}
                        </span>
                      )}
                      {book.submittedDate && (
                        <span className={`text-xs ${theme.textSecondary} flex items-center bg-off-white/50 dark:bg-brown-700/50 px-3 py-1 rounded-full`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(book.submittedDate).toLocaleDateString()}
                        </span>
                      )}
                  </div>
                </div>
                
                <div className="flex space-x-3 ml-6">
                  <button
                    onClick={() => handleApprove(book.id)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(book.id)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Generic List Content
  const ListContent = ({ title, data, type, icon: Icon }) => (
    <div className={`${theme.cardBg} ${theme.border} rounded-2xl shadow-xl border overflow-hidden backdrop-blur-lg`}>
      <div className="px-6 py-5 border-b border-brown-100 dark:border-brown-600 bg-gradient-to-r from-off-white-light to-off-white dark:from-brown-800 dark:to-brown-800">
        <h2 className={`text-2xl font-bold ${theme.text} flex items-center`}>
          <Icon className="h-6 w-6 mr-3 text-brown-600 dark:text-brown-400" />
          <span className="bg-gradient-to-r from-brown-600 to-brown-700 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <p className={`text-sm ${theme.textSecondary} mt-1`}>{data.length} {type} total</p>
      </div>
      
      <div className="p-6">
        {data.length === 0 ? (
          <div className="text-center py-12">
            <Icon className={`h-16 w-16 ${theme.textSecondary} mx-auto mb-6`} />
            <p className={`${theme.textSecondary} text-lg`}>No {type} found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.id || index} className={`p-5 rounded-xl ${theme.border} border ${theme.hover} transition-all duration-200 shadow-md hover:shadow-lg`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-lg ${theme.text}`}>
                      {item.name || item.title || `${item.firstName || ''} ${item.lastName || ''}`.trim() || `Item ${index + 1}`}
                    </h3>
                    <p className={`text-sm ${theme.textSecondary} mt-2`}>
                      {item.email || item.description || 'No additional information'}
                    </p>
                  </div>
                  {(item.status || item.isActive !== undefined) && (
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-md ${
                      item.status === 'active' || item.isActive 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                    }`}>
                      {item.status || (item.isActive ? 'Active' : 'Inactive')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      {/* Header */}
      <AdminHeader 
        darkMode={darkMode} 
        onToggleTheme={() => setDarkMode(!darkMode)}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 p-5 rounded-xl shadow-2xl max-w-sm backdrop-blur-sm ${
          notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
          notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' :
          'bg-gradient-to-r from-brown-500 to-brown-600 text-white' // Changed info notification color
        } transform transition-all duration-300 animate-pulse`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' && <CheckCircle className="h-6 w-6" />}
            {notification.type === 'error' && <AlertCircle className="h-6 w-6" />}
            {notification.type === 'info' && <Bell className="h-6 w-6" />} {/* Added info icon */}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${theme.text} mb-4`}>
              <span className="bg-gradient-to-r from-brown-600 via-brown-700 to-brown-800 bg-clip-text text-transparent">
                Dashboard Overview
              </span>
            </h1>
            <p className={`${theme.textSecondary} text-xl font-medium`}>Manage books and monitor platform activity</p>
            {error && (
              <div className="mt-4 p-4 bg-gradient-to-r from-brown-50 dark:from-brown-900/20 dark:to-brown-900/20 border border-brown-200 dark:border-brown-800 text-brown-800 dark:text-brown-200 rounded-xl text-sm shadow-md">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                {error}
              </div>
            )}
          </div>

          {/* Navigation */}
          <Navigation />

          {/* Content */}
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'pending' && <PendingBooksContent />}
          {activeTab === 'authors' && <ListContent title="Authors" data={authors} type="authors" icon={UserCheck} />}
          {activeTab === 'readers' && <ListContent title="Readers" data={readers} type="readers" icon={Users} />}
          {activeTab === 'summary' && <ListContent title="Books Summary" data={booksSummary} type="books" icon={BookCheck} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;