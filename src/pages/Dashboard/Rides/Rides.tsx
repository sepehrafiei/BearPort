import { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { RideType } from '../../../types/index';
import { fetchPaginatedRides, joinRide } from '../../../api/rides';
import AddRide from '../../../components/AddRide/AddRide';
import Ride from '../../../components/Ride/Ride';
import styles from './Rides.module.css';
import RideSearch from '../../../components/RideSearch/RideSearch';

function Rides() {
  const [searchFilters, setSearchFilters] = useState<{
    origin: string | null;
    destination: string | null;
    startDate: string | null;
    endDate: string | null;
  }>({
    origin: null,
    destination: null,
    startDate: null,
    endDate: null,
  });

  const pageSize = 8;

  const {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['rides', searchFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchPaginatedRides(pageParam, pageSize, searchFilters);
      if (response.error) throw response.error;
      return response.data || [];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === pageSize ? allPages.length + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  async function handleJoinRide(rideId: string) {
    const response = await joinRide(rideId);
    if (response.error) {
      console.error("Failed to join ride:", response.error);
      return;
    }

    queryClient.setQueryData(['rides', searchFilters], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: RideType[]) =>
          page.map((ride: RideType) =>
            ride.id === rideId
              ? {
                  ...ride,
                  joined: true,
                  count_members: (ride.count_members || 0) + 1,
                }
              : ride
          )
        ),
      };
    });

    queryClient.invalidateQueries({ queryKey: ['messages', rideId] });
  }

  const dialogRef = useRef<HTMLDialogElement>(null);

  function toggleDialog() {
    if (!dialogRef.current) return;
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const handleSearch = (filters: typeof searchFilters) => {
    setSearchFilters(filters);
    queryClient.removeQueries({ queryKey: ['rides'] }); // Clear old pages
    refetch(); // Refetch with new filters
  };

  const rides = data?.pages.flat() || [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '100px',
        threshold: 1.0,
      }
    );

    const sentinel = loadMoreRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className={styles.page}>
      <RideSearch onSearch={handleSearch} />
      
      <div className={styles.header}>
        <h2>Available Rides</h2>
      </div>

      <div className={styles.container}>
        {rides.length ? (
          rides.map((ride) => (
            <Ride key={ride.id} ride={ride} handleJoinRide={handleJoinRide} />
          ))
        ) : (
          <div className={styles.noRides}>
            <p>No rides available matching your search criteria.</p>
          </div>
        )}

        {/* Sentinel div for infinite scroll */}
        {hasNextPage && <div ref={loadMoreRef} style={{ height: 1 }} />}
        {isFetchingNextPage && (
          <div className={styles.loadingMore}>Loading more rides...</div>
        )}
      </div>

      <button className={styles.addButton} onClick={toggleDialog}>
        +
      </button>

      <dialog ref={dialogRef}>
        <AddRide toggleDialog={toggleDialog} searchFilters={searchFilters} />
      </dialog>
    </div>
  );
}

export default Rides;
