import dayjs from 'dayjs';
import { supabase, useQuery } from '../Store';

export const fetchHistory = async (setState) => {
  const data = await useQuery(
    supabase.from('history').select('*').order('created_at', { ascending: false }).limit(20)
  );

  const history = [];
  // Organise the events into their correct date categories
  data.forEach((item) => {
    const existingDate = history.find(
      ({ date }) => date === dayjs(item.createdAt).format('DD-MM-YYYY')
    );
    if (existingDate) {
      existingDate.history.push(item);
    } else {
      history.push({ date: dayjs(item.createdAt).format('DD-MM-YYYY'), history: [item] });
    }
  });

  if (setState) setState(history);

  return history;
};

export const x = () => {};
