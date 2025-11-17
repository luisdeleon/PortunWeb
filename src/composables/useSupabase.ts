import { supabase } from '@/plugins/supabase'
import type { User } from '@supabase/supabase-js'

export function useSupabase() {
  const user = ref<User | null>(null)
  const loading = ref(true)

  // Get current user
  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser()
      if (error) throw error
      user.value = currentUser

return currentUser
    }
    catch (error) {
      console.error('Error getting user:', error)

return null
    }
    finally {
      loading.value = false
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      user.value = data.user

return { data, error: null }
    }
    catch (error: any) {
      console.error('Error signing in:', error)

return { data: null, error }
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      if (error) throw error

return { data, error: null }
    }
    catch (error: any) {
      console.error('Error signing up:', error)

return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null

return { error: null }
    }
    catch (error: any) {
      console.error('Error signing out:', error)

return { error }
    }
  }

  // Listen to auth state changes
  const onAuthStateChange = (callback: (user: User | null) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      callback(user.value)
    })

    return subscription
  }

  // Initialize on composable creation
  onMounted(() => {
    getCurrentUser()
  })

  return {
    supabase,
    user,
    loading,
    getCurrentUser,
    signIn,
    signUp,
    signOut,
    onAuthStateChange,
  }
}
