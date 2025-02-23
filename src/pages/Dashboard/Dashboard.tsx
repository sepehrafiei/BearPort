import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import supabase from '../../helper/supabaseClient';
import { Session } from '@supabase/supabase-js';
import Navbar from '../../components/Navbar/Navbar';
import styles from "./Dashboard.module.css";


function Dashboard() {
    const [session, setSession] = useState<Session | null>(null)
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) {
                const name = session.user?.user_metadata?.full_name || session.user?.user_metadata?.name || "User";
                setUserName(name);
            }
          })
    }, [])



    return (
              <div className={styles.container}>
                  <Navbar />
                  <main className={styles.content}>
                      <Outlet />
                  </main>
              </div>
          );
      }

export default Dashboard