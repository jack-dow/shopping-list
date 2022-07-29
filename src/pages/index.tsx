import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import type { Supabase } from '../../types/supabase';

import { Header } from '../components/layout/Header';
import { Layout } from '../components/layout/Layout';
import { fetchList, fetchProduct } from '../queries';
import { supabase } from '../utils/supabaseClient';

const fetchListItems = async () => {
  const { data, error, status } = await supabase
    .from<Supabase.ListItem>('list_items')
    .select('*')
    .eq('list', '402ec969-4101-444a-808e-0b8968f399f1');

  console.log({ data, error, status });
};

const Home: NextPage = () => {
  fetchListItems();
  return (
    <Layout>
      <Header icon="👋" subtitle="G'day" title="The Kid" withSearch />
      <h1>Hello world</h1>
    </Layout>
  );
};

export default Home;
