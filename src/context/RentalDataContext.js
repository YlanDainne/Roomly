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
    try {
      const listingData = await rentalApi.getListings();
      const hotspotData = await rentalApi.getHotspots();

      let mergedListings = Array.isArray(listingData) ? listingData : [];

      // If user is signed in, fetch saved homes and merge saved flags to ensure UI matches user's favorites
      if (session) {
        try {
          const savedData = await rentalApi.getSavedHomes();
          const savedIds = Array.isArray(savedData) ? savedData.map((s) => s.id) : [];
          mergedListings = mergedListings.map((l) => ({ ...l, saved: savedIds.includes(l.id) }));
        } catch (innerErr) {
          console.warn('Failed to merge saved homes into listings:', innerErr);
        }
      }

      setListings(mergedListings);
      setHotspots(Array.isArray(hotspotData) ? hotspotData : []);
    } catch (err) {
      console.error('Error refreshing listings:', err);
      setError(err.message || 'Failed to refresh listings');
    }
  }, [session]);

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
    // Optimistic UI update: flip saved locally first
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, saved: !l.saved } : l))
    );
    // Also update savedHomes optimistically so merged state persists
    setSavedHomes((prev) => {
      if (listing.saved) {
        return prev.filter((s) => s.id !== listing.id);
      }
      // add listing to savedHomes
      return [...prev, listing];
    });

    try {
      if (listing.saved) {
        await rentalApi.unsaveListing(listing.id);
      } else {
        await rentalApi.saveListing(listing.id);
      }
      // Small delay to allow backend processing, then refresh authoritative state
      await new Promise((resolve) => setTimeout(resolve, 100));
      await refreshListings();
      await refreshSavedHomes();
    } catch (err) {
      console.error('Error toggling saved:', err);
      setError(err.message || 'Failed to save listing');
      // Revert optimistic update on error
      setListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, saved: listing.saved } : l))
      );
      setSavedHomes((prev) => {
        if (listing.saved) {
          // operation was to unsave; revert removal by adding back
          return [...prev, listing];
        }
        // operation was to save; revert add by removing
        return prev.filter((s) => s.id !== listing.id);
      });
    }
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
