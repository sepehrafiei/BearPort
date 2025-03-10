import { RoomType } from '../../../types/index';
import { getRooms } from '../../../api/rooms';
import { useQuery } from '@tanstack/react-query';

function Rooms() {
  const { status, error, data: rooms } = useQuery<RoomType[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
  });

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
              <p><strong>Host:</strong> {room.host_id}</p>
              <p><strong>Departure Time:</strong> {new Date(room.departure_time).toLocaleString()}</p>
              <p><strong>Capacity:</strong> {room.capacity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
}

export default Rooms;
