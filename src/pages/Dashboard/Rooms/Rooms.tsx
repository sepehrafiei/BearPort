import { RoomType } from '../../../types/index';
import { getRooms, joinRoom } from '../../../api/rooms';
import { useQuery } from '@tanstack/react-query';
import AddRoom from '../../../components/AddRoom/AddRoom';
import { useRef } from 'react';
import Room from '../../../components/Room/Room';
import styles from './Rooms.module.css'

function Rooms() {
  const { status, error, data: rooms } = useQuery<RoomType[]>({
    queryKey: ['rooms'],
    queryFn: getRooms,
  });

  async function handleJoinRoom(roomId : string) {
    const {error} = await joinRoom(roomId);
    window.location.reload();
    
  }

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
      <div className={styles.container}>
        {rooms?.length ? 
        rooms.map((room)=>(
          <Room key={room.id} room={room} handleJoinRoom={handleJoinRoom}/>
        ))
        : (
          <p>No rooms available.</p>
        )}
        <button onClick={()=> {
              toggleDialog();
            }}>Add Room
        </button>

      </div>
      <dialog ref={dialogRef}><AddRoom toggleDialog={toggleDialog}/></dialog>
    </div>
  );
}

export default Rooms;
