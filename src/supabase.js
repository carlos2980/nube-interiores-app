import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nowjsqpyukaizwbdekyr.supabase.co'
const supabaseKey = 'sb_publishable_cM0AlrtQigFVtg7YMqoBBg_enk9Rowp'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
