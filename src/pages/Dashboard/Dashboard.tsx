import React, {useState, useEffect} from 'react'
import supabase from '../../helper/supabaseClient'
import { useNavigate } from 'react-router'
import { Session } from '@supabase/supabase-js'

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

    const navigate = useNavigate()
    const signOut = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) throw error
        navigate("/login")
    }
  return (
    <div>
        <h1>Welcome {userName}!</h1>
        <button onClick={signOut}>Sign out</button>
    </div>
  )
}

export default Dashboard