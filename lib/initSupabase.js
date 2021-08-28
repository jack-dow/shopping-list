import { CheckCircleIcon } from '@heroicons/react/solid';
import { createClient } from '@supabase/supabase-js';

import Toast from '../components/Toast';
import { snakeToCamelCase } from '../utils/caseTransform';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const useQuery = async (query) => {
  const { body, error } = await query;

  if (error) {
    console.log('error', error);
    Toast({
      title: 'An error occured.',
      text: 'If the issue persists, please try refeshing the page',
      icon: <CheckCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />,
      duration: 2000,
    });

    return [];
  }

  return snakeToCamelCase(body);
};
