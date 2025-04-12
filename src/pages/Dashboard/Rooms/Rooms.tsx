import { useState, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { RideType } from '../../../types/index';
import { fetchPaginatedRides, joinRide } from '../../../api/rooms';
import AddRoom from '../../../components/AddRoom/AddRoom';
import Room from '../../../components/Room/Room';
import styles from './Rooms.module.css';
import RideSearch from '../../../components/RideSearch/RideSearch';

function Rooms() {
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
    refetch
  } = useInfiniteQuery({
    queryKey: ['rides', searchFilters],
    queryFn: ({ pageParam = 1 }) =>
      fetchPaginatedRides(pageParam, pageSize, searchFilters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length == pageSize ? allPages.length + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  async function handleJoinRide(rideId: string) {
    await joinRide(rideId);
    if (error) {
      console.error("Failed to join ride:", error);
      return;
    }

    queryClient.setQueryData(["rides", searchFilters], (oldData: any) => {
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

  return (
    <div className={styles.page}>

      <RideSearch onSearch={handleSearch} /> {/* Hooked up here */}
      <h2>Available Rides</h2>
      <div className={styles.container}>
        {rides.length ? (
          rides.map((ride) => (
            <Room key={ride.id} room={ride} handleJoinRoom={handleJoinRide} />
          ))
        ) : (
          <p>No rides available.</p>
        )}

        {hasNextPage && (
          <button onClick={() => fetchNextPage()}>Load More</button>
        )}

        <button onClick={toggleDialog}>Add Ride</button>
      </div>

      <dialog ref={dialogRef}>
        <AddRoom toggleDialog={toggleDialog} />
      </dialog>
    </div>
  );
}

export default Rooms;
