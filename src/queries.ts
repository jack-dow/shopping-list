import axios from 'axios';
import { supabase } from './utils/supabaseClient';

const woolworths = 'https://www.woolworths.com.au/apis/ui';

export const fetchProduct = async (stockcode: string) => {
  const { data } = await axios.get(`${woolworths}/product/${stockcode}`);
  return data;
};

export const fetchList = async (listId: string) => {
  const { data, error, status } = await supabase
    .from('list_items')
    .select('*')
    .eq('list', listId);
};
