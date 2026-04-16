import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: meds, error: medsError } = await supabase
          .from('medicines')
          .select('*')
          .order('name');
        
        if (medsError) throw medsError;
        setMedicines(meds || []);

        const { data: bks, error: bksError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (bksError) throw bksError;
        setBookings(bks || []);
      } catch (error) {
        console.error('Error fetching clinical data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Persistent user session (Local)
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const addMedicine = async (medicine) => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .insert([{ ...medicine }])
        .select();
      
      if (error) throw error;
      setMedicines(prev => [...prev, data[0]]);
      return { success: true };
    } catch (error) {
      console.error('Add Asset Error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const updateStock = async (id, newStock) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .update({ stock: newStock })
        .eq('id', id);
      
      if (error) throw error;
      setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: newStock } : m));
    } catch (error) {
      console.error('Stock Update Error:', error.message);
    }
  };

  const deleteMedicine = async (id) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMedicines(prev => prev.filter(m => m.id !== id));
    } catch (error) {
        console.error('Deletion Error:', error.message);
    }
  };

  const bookMedicine = async (medicineId, quantity) => {
    try {
      const medicine = medicines.find(m => m.id === medicineId);
      if (!medicine || medicine.stock < quantity) return { success: false, error: 'Insufficient Reserve' };

      const newBooking = {
        medicine_id: medicineId,
        medicine_name: medicine.name,
        quantity,
        user_id: user.id.toString(),
        user_name: user.name,
        status: 'Confirmed'
      };

      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert([newBooking])
        .select();
      
      if (bookingError) throw bookingError;

      // Update local and remote stock
      const updatedStock = medicine.stock - quantity;
      await updateStock(medicineId, updatedStock);

      setBookings(prev => [data[0], ...prev]);
      return { success: true };
    } catch (error) {
      console.error('Booking Protocol Error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const login = (role, name) => {
    const newUser = { id: Date.now(), role, name };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <StoreContext.Provider value={{
      medicines,
      bookings,
      user,
      loading,
      addMedicine,
      updateStock,
      deleteMedicine,
      bookMedicine,
      login,
      logout,
      setMedicines
    }}>
      {children}
    </StoreContext.Provider>
  );
};
