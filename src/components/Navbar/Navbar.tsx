import { Link } from 'react-router'
import supabase from '../../helper/supabaseClient'
import { useNavigate } from 'react-router'
import styles from './Navbar.modules.css'

function Navbar() {
    const signOut = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) throw error
        navigate("/")
    }
    const navigate = useNavigate()
  return (
    <div>
        <Link to="/dashboard">Profile</Link>
        <Link to="/dashboard/rooms">Rooms</Link>
        <button onClick={signOut}>Logout</button>
    </div>
  )
}

export default Navbar