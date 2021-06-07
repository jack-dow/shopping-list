import { createClient } from '@supabase/supabase-js';

import { snakeToCamelCase } from './caseTransform';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const useQuery = async (query) => {
  const { data, error } = await query;

  if (error) {
    if (error.message === 'JWT expired' && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    console.log(`Error in useQuery: `, error);
    return [];
  }

  if (!data) {
    return [];
  }

  return snakeToCamelCase(data);
};

export { supabase, useQuery };
