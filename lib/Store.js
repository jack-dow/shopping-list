/* eslint-disable no-use-before-define */
import { CheckCircleIcon } from '@heroicons/react/solid';
import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

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
      text: 'Check console for more information.',
      icon: <CheckCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />,
      duration: 2000,
    });

    return [];
  }

  return snakeToCamelCase(body);
};

// Fetch all history
export const fetchHistory = async (setState) => {
  const data = await useQuery(
    supabase.from('history').select('*').order('created_at', { ascending: false }).limit(60)
  );

  const history = [];
  data.forEach((item) => {
    const existingDate = history.find(
      ({ date }) => date === dayjs(item.createdAt).format('MM-DD-YYYY')
    );
    if (existingDate) {
      existingDate.history.push(item);
    } else {
      history.push({ date: dayjs(item.createdAt).format('MM-DD-YYYY'), history: [item] });
    }
  });

  if (setState) setState(history);

  return history;
};

export const fetchUsers = async (setState) => {
  const data = await useQuery(supabase.from('users').select('id,name,email'));
  if (setState) setState(data);

  return data;
};
