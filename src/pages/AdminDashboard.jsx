import React, { useState, useEffect } from 'react';
import { Shield, Users, Home, Car, Calendar, DollarSign, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

export default function AdminDashboard({ setCurrentPage }) {
  const { currentUser, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // Redirect non-admins
  if (!currentUser || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-safra-sandlight flex items-center justify-center pt-20">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">
          <div className="w-16 h-16 bg-safra-corallight rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-safra-coral" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-safra-navy mb-2">Access Denied</h2>
          <p className="text-safra-gray font-body mb-6">You need admin privileges to access this dashboard.</p>
          <button onClick={() => setCurrentPage('home')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: false });
      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch all listings with owner name
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select(`
          *,
          owner:owner_id (full_name)
        `)
        .order('created_at', { ascending: false });
      if (listingsError) throw listingsError;
      setListings(listingsData || []);

      // Fetch all bookings with guest and listing info
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          guest:guest_id (full_name),
          listing:listing_id (name, owner_id)
        `)
        .order('created_at', { ascending: false });
      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (err) {
      console.error('Error fetching admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currentUser]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error updating role:', err.message);
      alert('Error: ' + err.message);
    }
  };

  const handleToggleListingActive = async (id, current) => {
    try {
      const { error } = await supabase.from('listings').update({ is_active: !current }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error toggling listing:', err.message);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting listing:', err.message);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting booking:', err.message);
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  const tabs = [
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'listings', label: 'Listings', icon: Home, count: listings.length },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: bookings.length },
  ];

  return (
    <div className="min-h-screen bg-safra-sandlight pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2 flex items-center gap-3">
            <Shield size={32} className="text-safra-terracotta" />
            Admin Dashboard
          </h1>
          <p className="text-safra-gray font-body">Platform overview and management.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-safra-blue/10 rounded-lg flex items-center justify-center">
                <Users size={20} className="text-safra-blue" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-safra-navy">{users.length}</p>
                <p className="text-xs text-safra-gray font-body">Total Users</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-safra-terracotta/10 rounded-lg flex items-center justify-center">
                <Home size={20} className="text-safra-terracotta" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-safra-navy">{listings.length}</p>
                <p className="text-xs text-safra-gray font-body">Total Listings</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-safra-turquoise/10 rounded-lg flex items-center justify-center">
                <Calendar size={20} className="text-safra-turquoisedark" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-safra-navy">{bookings.length}</p>
                <p className="text-xs text-safra-gray font-body">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-safra-yellow/20 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-safra-navy" />
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-safra-navy">{totalRevenue} <span className="text-sm">TND</span></p>
                <p className="text-xs text-safra-gray font-body">Platform Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-serif font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-safra-terracotta text-white shadow-md'
                  : 'bg-white text-safra-gray hover:bg-safra-sandlight'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-safra-sand text-safra-navy'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-safra-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-safra-gray font-body">Loading...</p>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-safra-sandlight border-b border-safra-sand">
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Full Name</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Role</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="font-body">
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-safra-sand/50 hover:bg-safra-sandlight/50 transition-colors">
                          <td className="px-5 py-3 text-safra-navy font-semibold">{u.full_name || 'N/A'}</td>
                          <td className="px-5 py-3">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider outline-none cursor-pointer transition-all ${
                                u.role === 'admin' ? 'bg-red-100 text-red-700 border border-red-200' :
                                u.role === 'host' ? 'bg-sky-100 text-sky-700 border border-sky-200' :
                                'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              <option value="traveler">Traveler</option>
                              <option value="host">Host</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-5 py-3 text-safra-gray text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {users.length === 0 && (
                  <div className="text-center py-10">
                    <Users size={32} className="text-safra-graylight mx-auto mb-2" />
                    <p className="text-safra-gray font-body text-sm">No users found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-safra-sandlight border-b border-safra-sand">
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Listing</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Owner</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Type</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Price</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Status</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="font-body">
                      {listings.map((l) => (
                        <tr key={l.id} className="border-b border-safra-sand/50 hover:bg-safra-sandlight/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img src={l.image_url || 'https://via.placeholder.com/40?text=?'} alt={l.name} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <p className="font-semibold text-safra-navy">{l.name}</p>
                                <p className="text-xs text-safra-gray">{l.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-safra-gray">{l.owner?.full_name || 'Unknown'}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${l.type === 'house' ? 'bg-safra-terracotta/10 text-safra-terracotta' : 'bg-safra-blue/10 text-safra-blue'}`}>
                              {l.type}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-serif font-bold text-safra-navy">{l.price} TND</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${l.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {l.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => handleToggleListingActive(l.id, l.is_active)} className="w-8 h-8 rounded-lg bg-safra-sandlight flex items-center justify-center text-safra-navy hover:bg-safra-terracotta hover:text-white transition-all" title={l.is_active ? 'Deactivate' : 'Activate'}>
                                {l.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button onClick={() => handleDeleteListing(l.id)} className="w-8 h-8 rounded-lg bg-safra-sandlight flex items-center justify-center text-safra-navy hover:bg-red-500 hover:text-white transition-all" title="Delete">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {listings.length === 0 && (
                  <div className="text-center py-10">
                    <Home size={32} className="text-safra-graylight mx-auto mb-2" />
                    <p className="text-safra-gray font-body text-sm">No listings found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-safra-sandlight border-b border-safra-sand">
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Listing</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Guest</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Check-in</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Check-out</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Price</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Status</th>
                        <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="font-body">
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b border-safra-sand/50 hover:bg-safra-sandlight/50 transition-colors">
                          <td className="px-5 py-3 text-safra-navy font-semibold">{b.listing?.name || 'Unknown'}</td>
                          <td className="px-5 py-3 text-safra-gray">{b.guest?.full_name || 'Unknown'}</td>
                          <td className="px-5 py-3 text-safra-gray">{b.check_in}</td>
                          <td className="px-5 py-3 text-safra-gray">{b.check_out}</td>
                          <td className="px-5 py-3 font-serif font-bold text-safra-navy">{b.total_price} TND</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                              b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                              b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <button onClick={() => handleDeleteBooking(b.id)} className="w-8 h-8 rounded-lg bg-safra-sandlight flex items-center justify-center text-safra-navy hover:bg-red-500 hover:text-white transition-all" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {bookings.length === 0 && (
                  <div className="text-center py-10">
                    <Calendar size={32} className="text-safra-graylight mx-auto mb-2" />
                    <p className="text-safra-gray font-body text-sm">No bookings found.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
