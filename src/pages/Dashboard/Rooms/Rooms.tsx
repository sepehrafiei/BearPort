import { RoomType } from '../../../types/index';
import { fetchPaginatedRooms, joinRoom } from '../../../api/rooms';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import AddRoom from '../../../components/AddRoom/AddRoom';
import { useRef } from 'react';
import Room from '../../../components/Room/Room';
import styles from './Rooms.module.css'

function Rooms() {
  
  function usePaginatedRooms(pageSize: number) {
    return useInfiniteQuery({
      queryKey: ["rooms"],
      queryFn: ({ pageParam = 1 }) => fetchPaginatedRooms(pageParam, pageSize),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => 
        lastPage.length == pageSize ? allPages.length + 1 : undefined, // Load next page if results exist
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
  }

  const pageSize = 2; // Customize as needed
  const { data, error, status, fetchNextPage, hasNextPage } = usePaginatedRooms(pageSize);

  const queryClient = useQueryClient(); // React Query Client

  async function handleJoinRoom(roomId: string) {
    const { error } = await joinRoom(roomId);
    if (error) {
      console.error("Failed to join room:", error);
      return;
    }
  
    // Update the specific room in the cache instead of refreshing the page
    queryClient.setQueryData(["rooms"], (oldData: any) => {
      if (!oldData) return oldData;
  
      return {
        ...oldData,
        pages: oldData.pages.map((page: RoomType[]) =>
          page.map((room: RoomType) =>
            room.id === roomId
              ? { 
                  ...room, 
                  joined: true, 
                  count_members: (room.count_members || 0) + 1 // Increase count_members by 1
                }
              : room
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
  const rooms = data?.pages.flat() || [];

  return (
    <div>
      <h2>Available Rooms</h2>
      <div className={styles.container}>
        {rooms.length ? 
          rooms.map((room) => (
            <Room key={room.id} room={room} handleJoinRoom={handleJoinRoom} />
          ))
        : (
          <p>No rooms available.</p>
        )}
        
        {/* Load More Button */}
        {hasNextPage && (
          <button onClick={() => fetchNextPage()}>Load More</button>
        )}
        
        <button onClick={toggleDialog}>Add Room</button>
      </div>

      <dialog ref={dialogRef}>
        <AddRoom toggleDialog={toggleDialog} />
      </dialog>
    </div>
  );
}

export default Rooms;
