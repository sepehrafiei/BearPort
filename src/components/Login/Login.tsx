import React, { useEffect, useState } from 'react'
import supabase from "../../helper/supabaseClient.ts"
import { Link, useNavigate} from 'react-router'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa} from '@supabase/auth-ui-shared'
import { Session } from "@supabase/supabase-js";
import styles from "./Login.module.css"


export default function Login() {
    const navigate = useNavigate()
    const [session, setSession] = useState<Session | null>(null)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
  
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })
  
        return () => subscription.unsubscribe()
      }, [navigate])
  
      if (!session) {
        return (
          <div className={styles.container}>
            <h1>FIND FELLOW BEARS TO GO TO THE AIRPORT WITH!</h1>
            <p>Sign in with your student gmail: </p>
            <Auth 
        supabaseClient={supabase} 
        providers={['google']} 
        appearance={{
          theme: ThemeSupa,
          className: {
            button: styles.authButton,
          },
        }
        
      }
        redirectTo={`${window.location.origin}/dashboard`} 
        onlyThirdPartyProviders
        />
          </div>
        )
      }
      else {
        navigate('/dashboard')
        return null
      }
}