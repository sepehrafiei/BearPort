import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import supabase from '../../helper/supabaseClient';
import Navbar from '../../components/Navbar/Navbar';
import styles from "./Dashboard.module.css";

function Dashboard() {
    useEffect(() => {
        supabase.auth.getSession();
    }, []);

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;
