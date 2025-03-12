import { RoomType } from '../../../types/index';
import { getRooms } from '../../../api/rooms';
import { useQuery } from '@tanstack/react-query';
import AddRoom from '../../../components/AddRoom/AddRoom';
import { useRef } from 'react';

function Rooms() {
  const { status, error, data: rooms } = useQuery<RoomType[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
  });

  console.log(rooms);

  const dialogRef = useRef<HTMLDialogElement>(null);
  
    function toggleDialog() {
      if(!dialogRef.current) {
        return;
      }
      dialogRef.current.hasAttribute("open") 
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
    }

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error')
    return <p>Error: {error instanceof Error ? error.message : 'An error occurred'}</p>;

  return (
    <div>
      <h2>Available Rooms</h2>
      {rooms?.length ? (
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              <p><strong>Host:</strong> {room.profiles?.[0]?.full_name}</p>
              <p><strong>{room.origin} to {room.destination}</strong></p>
              <p><strong>Departure Time:</strong> {room.departure_time}</p>
              <p><strong>Capacity:</strong> {room.capacity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available.</p>
      )}
      <button onClick={()=> {
            toggleDialog();
          }}>Add Room</button>
      <dialog ref={dialogRef}><AddRoom toggleDialog={toggleDialog}/></dialog>
    </div>
  );
}

export default Rooms;
