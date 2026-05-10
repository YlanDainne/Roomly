import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { rentalApi } from '../services/rentalApi';
import { useAuth } from './AuthContext';

const RentalDataContext = createContext(null);

export const RentalDataProvider = ({ children }) => {
  const { session } = useAuth();
  const [listings, setListings] = useState([]);
  const [savedHomes, setSavedHomes] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [listingData, hotspotData, campusData] = await Promise.all([
        rentalApi.getListings(),
        rentalApi.getHotspots(),
        rentalApi.getCampuses()
      ]);

      setListings(listingData);
      setHotspots(hotspotData);
      setCampuses(campusData);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load rental data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const refreshListings = useCallback(async () => {
    const listingData = await rentalApi.getListings();
    const hotspotData = await rentalApi.getHotspots();
    setListings(listingData);
    setHotspots(hotspotData);
  }, []);

  const refreshSavedHomes = useCallback(async () => {
    if (!session) {
      setSavedHomes([]);
      return;
    }

    const savedData = await rentalApi.getSavedHomes();
    setSavedHomes(savedData);
  }, [session]);

  useEffect(() => {
    if (!session) {
      setSavedHomes([]);
      return;
    }

    refreshSavedHomes().catch((fetchError) => {
      setError(fetchError.message || 'Unable to load saved homes.');
    });
  }, [session, refreshSavedHomes]);

  const createListing = useCallback(async (formData) => {
    await rentalApi.createListing(formData);
    await loadAll();
  }, [loadAll]);

  const updateListing = useCallback(async (id, formData) => {
    await rentalApi.updateListing(id, formData);
    await loadAll();
  }, [loadAll]);

  const deleteListing = useCallback(async (id) => {
    await rentalApi.deleteListing(id);
    await loadAll();
  }, [loadAll]);

  const toggleSaved = useCallback(async (listing) => {
    if (listing.saved) {
      await rentalApi.unsaveListing(listing.id);
    } else {
      await rentalApi.saveListing(listing.id);
    }
    await refreshListings();
    await refreshSavedHomes();
  }, [refreshListings, refreshSavedHomes]);

  const value = useMemo(
    () => ({
      listings,
      savedHomes,
      hotspots,
      campuses,
      loading,
      error,
      refreshListings,
      refreshSavedHomes,
      createListing,
      updateListing,
      deleteListing,
      toggleSaved
    }),
    [
      listings,
      savedHomes,
      hotspots,
      campuses,
      loading,
      error,
      refreshListings,
      refreshSavedHomes,
      createListing,
      updateListing,
      deleteListing,
      toggleSaved
    ]
  );

  return <RentalDataContext.Provider value={value}>{children}</RentalDataContext.Provider>;
};

export const useRentalData = () => {
  const context = useContext(RentalDataContext);
  if (!context) {
    throw new Error('useRentalData must be used inside a RentalDataProvider');
  }
  return context;
};
