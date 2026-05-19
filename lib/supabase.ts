<<<<<<< HEAD
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ydbpcgvjvmecoykspcrl.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYnBjZ3Zqdm1lY295a3NwY3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMDc0NDAsImV4cCI6MjA5NDU4MzQ0MH0.oanC-2szoN9Y9Xy_hWFApva3sUR5QJygNcdPE-CtOyA";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
=======
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nqxhtawwienmwrhhrehu.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xeGh0YXd3aWVubXdyaGhyZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzE1ODEsImV4cCI6MjA5NDQ0NzU4MX0.I4z8BVRyQCcJnWKmBmUfco7vUBxt1xkXRECFYxvQh8I'

export const supabase = createClient(supabaseUrl, supabaseKey)
>>>>>>> a6a816e (Registration and QR generation completed)
