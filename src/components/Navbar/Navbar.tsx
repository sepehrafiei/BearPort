import { Link } from 'react-router'
import supabase from '../../helper/supabaseClient'
import { useNavigate } from 'react-router'
import styles from './Navbar.module.css'

function Navbar() {
    const signOut = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) throw error
        navigate("/")
    }
    const navigate = useNavigate()
    return (
      <div className={styles.container}>
        <div className={styles.navbar}>
            <Link to="/dashboard">
                <button className={location.pathname === "/dashboard" ? styles.active : ""}>Profile</button>
            </Link>
            <Link to="/dashboard/rooms">
                <button className={location.pathname === "/dashboard/rooms" ? styles.active : ""}>Rides</button>
            </Link>
            <Link to="/dashboard/messages">
                <button className={location.pathname === "/dashboard/messages" ? styles.active : ""}>Messages</button>
            </Link>
            <Link to="/dashboard/donation">
                <button className={location.pathname === "/dashboard/donation" ? styles.active : ""}>Donate</button>
            </Link>
            <button onClick={signOut}>Logout</button>
        </div>

        <div className={styles.divider}></div>
      </div>
  );
}

export default Navbar;