import { RideType } from '../../../types/index';
import { fetchPaginatedRides, joinRide } from '../../../api/rooms';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import AddRoom from '../../../components/AddRoom/AddRoom';
import { useRef } from 'react';
import Room from '../../../components/Room/Room';
import styles from './Rooms.module.css'
import Search from '../../../components/RideSearch/RideSearch'

function Rooms() {
  
  function usePaginatedRides(pageSize: number) {
    return useInfiniteQuery({
      queryKey: ["rides"],
      queryFn: ({ pageParam = 1 }) => fetchPaginatedRides(pageParam, pageSize),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => 
        lastPage.length == pageSize ? allPages.length + 1 : undefined, // Load next page if results exist
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
  }

  const pageSize = 8; // Customize as needed
  const { data, error, status, fetchNextPage, hasNextPage } = usePaginatedRides(pageSize);

  const queryClient = useQueryClient(); // React Query Client

  async function handleJoinRide(rideId: string) {
    await joinRide(rideId);
    if (error) {
      console.error("Failed to join ride:", error);
      return;
    }
  
    // Update the specific ride in the cache instead of refreshing the page
    queryClient.setQueryData(["rides"], (oldData: any) => {
      if (!oldData) return oldData;
  
      return {
        ...oldData,
        pages: oldData.pages.map((page: RideType[]) =>
          page.map((ride: RideType) =>
            ride.id === rideId
              ? { 
                  ...ride, 
                  joined: true, 
                  count_members: (ride.count_members || 0) + 1 // Increase count_members by 1
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

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error')
    return <p>Error: {error instanceof Error ? error.message : 'An error occurred'}</p>;

  // Flatten paginated data into a single array
  const rides = data?.pages.flat() || [];

  return (
    <div>
      <h2>Available Rides</h2>
      {/* where ridesearch should go */}
      <div className={styles.container}>
        {rides.length ? 
          rides.map((ride) => (
            <Room key={ride.id} room={ride} handleJoinRoom={handleJoinRide} />
          ))
        : (
          <p>No rides available.</p>
        )}
        
        {/* Load More Button */}
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
