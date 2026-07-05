import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Home, Car, Plus, Edit2, Eye, EyeOff, Calendar, DollarSign, Users, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

export default function HostDashboard({ setCurrentPage }) {
  const { currentUser, userRole } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'house',
    name: '',
    price: '',
    location: '',
    image_url: '',
    description: '',
    guests_or_seats: '',
    amenities_or_features: '',
    tag: 'New',
  });

  // Redirect non-hosts
  if (!currentUser || userRole !== 'host') {
    return (
      <div className="min-h-screen bg-safra-sandlight flex items-center justify-center pt-20">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">
          <div className="w-16 h-16 bg-safra-corallight rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard size={28} className="text-safra-coral" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-safra-navy mb-2">Access Denied</h2>
          <p className="text-safra-gray font-body mb-6">You need a host account to access this dashboard.</p>
          <button onClick={() => setCurrentPage('home')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const firstName = (currentUser?.full_name || 'Host').split(' ')[0];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch host's listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      setListings(listingsData || []);

      // Fetch bookings for host's listings
      if (listingsData && listingsData.length > 0) {
        const listingIds = listingsData.map(l => l.id);
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            guest:guest_id (full_name),
            listing:listing_id (name, type)
          `)
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching host dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        owner_id: currentUser.id,
        type: formData.type,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price) || 0,
        image_url: formData.image_url,
        guests_or_seats: parseInt(formData.guests_or_seats) || 1,
        amenities_or_features: formData.amenities_or_features.split(',').map(s => s.trim()).filter(Boolean),
        tag: formData.tag || 'New',
      };

      if (editingId) {
        const { error } = await supabase.from('listings').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('listings').insert([payload]);
        if (error) throw error;
      }

      setShowAddForm(false);
      setEditingId(null);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving listing:', err.message);
      alert('Error saving listing: ' + err.message);
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      const { error } = await supabase.from('listings').update({ is_active: !current }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error toggling listing:', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting listing:', err.message);
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setFormData({
      type: listing.type,
      name: listing.name,
      price: listing.price,
      location: listing.location || '',
      image_url: listing.image_url || '',
      description: listing.description || '',
      guests_or_seats: listing.guests_or_seats || '',
      amenities_or_features: Array.isArray(listing.amenities_or_features) ? listing.amenities_or_features.join(', ') : listing.amenities_or_features || '',
      tag: listing.tag || 'New',
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'house', name: '', price: '', location: '', image_url: '',
      description: '', guests_or_seats: '', amenities_or_features: '', tag: 'New',
    });
  };

  const totalEarnings = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  const activeBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;

  const tagColors = {
    "Popular": "bg-safra-coral text-white",
    "Luxury": "bg-safra-yellow text-safra-navy",
    "Beach": "bg-sky-400 text-white",
    "New": "bg-safra-turquoise text-white",
    "Island": "bg-emerald-400 text-white",
    "Adventure": "bg-orange-400 text-white",
    "Budget": "bg-green-400 text-white",
    "Family": "bg-safra-yellow text-safra-navy",
    "City": "bg-safra-turquoise text-white",
    "Off-Road": "bg-amber-600 text-white",
    "Comfort": "bg-safra-coral text-white",
  };

  return (
    <div className="min-h-screen bg-safra-sandlight pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Welcome back, {firstName}!</h1>
          <p className="text-safra-gray font-body">Manage your listings and bookings from one place.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-safra-terracotta/10 rounded-xl flex items-center justify-center">
                <Home size={24} className="text-safra-terracotta" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-safra-navy">{listings.length}</p>
                <p className="text-sm text-safra-gray font-body">Total Listings</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-safra-blue/10 rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-safra-blue" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-safra-navy">{activeBookingsCount}</p>
                <p className="text-sm text-safra-gray font-body">Active Bookings</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-safra-turquoise/10 rounded-xl flex items-center justify-center">
                <DollarSign size={24} className="text-safra-turquoisedark" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-safra-navy">{totalEarnings} <span className="text-lg">TND</span></p>
                <p className="text-sm text-safra-gray font-body">Total Earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif font-bold text-2xl text-safra-navy flex items-center gap-2">
              {formData.type === 'car' ? <Car size={22} className="text-safra-terracotta" /> : <Home size={22} className="text-safra-terracotta" />}
              My Listings
            </h2>
            <button
              onClick={() => { setShowAddForm(true); setEditingId(null); resetForm(); }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> Add New Listing
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-safra-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-safra-gray font-body">Loading your listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center">
              <Home size={40} className="text-safra-graylight mx-auto mb-3" />
              <p className="font-serif font-bold text-lg text-safra-navy mb-1">No listings yet</p>
              <p className="text-safra-gray font-body text-sm mb-4">Add your first house or car to start earning.</p>
              <button onClick={() => { setShowAddForm(true); setEditingId(null); resetForm(); }} className="btn-secondary text-sm">
                <Plus size={16} className="inline mr-1" /> Add Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((listing) => (
                <div key={listing.id} className={`card ${!listing.is_active ? 'opacity-60' : ''}`}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={listing.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} alt={listing.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${tagColors[listing.tag] || 'bg-safra-gray text-white'}`}>
                        {listing.tag}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button onClick={() => handleEdit(listing)} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-safra-navy hover:text-safra-terracotta transition-all shadow-sm" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleToggleActive(listing.id, listing.is_active)} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-safra-navy hover:text-safra-terracotta transition-all shadow-sm" title={listing.is_active ? 'Deactivate' : 'Activate'}>
                        {listing.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-safra-navy/80 text-white">
                        {listing.price} TND
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      {listing.type === 'car' ? <Car size={14} className="text-safra-terracotta" /> : <Home size={14} className="text-safra-terracotta" />}
                      <span className="text-xs font-bold uppercase tracking-wider text-safra-terracotta">{listing.type}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-safra-navy mb-1">{listing.name}</h3>
                    <p className="text-safra-gray text-sm font-body line-clamp-2 mb-2">{listing.description}</p>
                    <div className="flex items-center gap-3 text-xs text-safra-graylight font-body">
                      <span>{listing.location}</span>
                      <span>&middot;</span>
                      <span>{listing.guests_or_seats} {listing.type === 'house' ? 'guests' : 'seats'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="mb-10">
          <h2 className="font-serif font-bold text-2xl text-safra-navy flex items-center gap-2 mb-6">
            <Calendar size={22} className="text-safra-terracotta" />
            Recent Bookings
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-safra-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-safra-gray font-body text-sm">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <Calendar size={32} className="text-safra-graylight mx-auto mb-2" />
              <p className="font-serif font-bold text-safra-navy mb-1">No bookings yet</p>
              <p className="text-safra-gray font-body text-sm">Bookings will appear here when travelers reserve your listings.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-safra-sandlight border-b border-safra-sand">
                      <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Guest</th>
                      <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Listing</th>
                      <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Check-in</th>
                      <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Check-out</th>
                      <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Price</th>
                      <th className="text-left px-5 py-3 font-serif font-bold text-safra-navy">Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-body">
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-safra-sand/50 hover:bg-safra-sandlight/50 transition-colors">
                        <td className="px-5 py-3 text-safra-navy font-semibold">{b.guest?.full_name || 'Unknown'}</td>
                        <td className="px-5 py-3 text-safra-gray">{b.listing?.name || 'Unknown'}</td>
                        <td className="px-5 py-3 text-safra-gray">{b.check_in}</td>
                        <td className="px-5 py-3 text-safra-gray">{b.check_out}</td>
                        <td className="px-5 py-3 font-serif font-bold text-safra-navy">{b.total_price} TND</td>
                        <td className="px-5 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Listing Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-safra-sand">
              <h3 className="font-serif font-bold text-xl text-safra-navy">
                {editingId ? 'Edit Listing' : 'Add New Listing'}
              </h3>
              <button onClick={() => setShowAddForm(false)} className="w-9 h-9 rounded-full bg-safra-sandlight flex items-center justify-center text-safra-navy hover:bg-safra-terracotta hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-bold text-safra-navy mb-2">Listing Type</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'house' })} className={`flex-1 py-2.5 rounded-xl font-serif font-bold text-sm transition-all ${formData.type === 'house' ? 'bg-safra-terracotta text-white shadow-md' : 'bg-safra-sandlight text-safra-gray hover:bg-safra-sand'}`}>
                    <Home size={16} className="inline mr-1" /> House
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, type: 'car' })} className={`flex-1 py-2.5 rounded-xl font-serif font-bold text-sm transition-all ${formData.type === 'car' ? 'bg-safra-terracotta text-white shadow-md' : 'bg-safra-sandlight text-safra-gray hover:bg-safra-sand'}`}>
                    <Car size={16} className="inline mr-1" /> Car
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-safra-navy mb-1.5">Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all" placeholder={formData.type === 'house' ? 'Dar El Medina' : 'Peugeot 3008'} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-safra-navy mb-1.5">Price (TND)</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all" placeholder="180" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-safra-navy mb-1.5">{formData.type === 'house' ? 'Guests' : 'Seats'}</label>
                  <input required type="number" min="1" value={formData.guests_or_seats} onChange={e => setFormData({ ...formData, guests_or_seats: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all" placeholder="4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-safra-navy mb-1.5">{formData.type === 'house' ? 'Location' : 'Type Detail'}</label>
                <input required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all" placeholder={formData.type === 'house' ? 'Tunis' : 'SUV / Automatic'} />
              </div>

              <div>
                <label className="block text-sm font-bold text-safra-navy mb-1.5">Image URL</label>
                <input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all" placeholder="https://images.unsplash.com/..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-safra-navy mb-1.5">Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all resize-none" placeholder="Short description..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-safra-navy mb-1.5">
                  {formData.type === 'house' ? 'Amenities' : 'Features'} <span className="text-safra-gray font-normal">(comma-separated)</span>
                </label>
                <input value={formData.amenities_or_features} onChange={e => setFormData({ ...formData, amenities_or_features: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all" placeholder={formData.type === 'house' ? 'WiFi, Kitchen, Pool' : 'AC, GPS, Bluetooth'} />
              </div>

              <div>
                <label className="block text-sm font-bold text-safra-navy mb-1.5">Tag</label>
                <select value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-safra-navy font-body focus:border-safra-terracotta focus:ring-2 focus:ring-safra-terracotta/10 outline-none transition-all bg-white">
                  <option value="New">New</option>
                  <option value="Popular">Popular</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Budget">Budget</option>
                  <option value="Family">Family</option>
                  <option value="Beach">Beach</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Comfort">Comfort</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2.5 rounded-xl font-serif font-bold text-sm bg-safra-sandlight text-safra-navy hover:bg-safra-sand transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 btn-primary text-sm">
                  {editingId ? 'Update Listing' : 'Add Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
