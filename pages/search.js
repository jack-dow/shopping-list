import { NextSeo } from 'next-seo';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';

function Search() {
  return (
    <Layout>
      <NextSeo title="Product Search | TKIT Shopping List" />
      <div className="px-4 py-8">
        <Header icon="🔍" titleSmall="Find exactly" title="What you need" productSearch />
        <EmptyState
          show
          img={
            <img src="/search.svg" alt="Drawing a detective searching a phone" className="h-72" />
          }
          title="What are you looking for today?"
          description="Start the search by entering the product name into the search bar"
        />
      </div>
    </Layout>
  );
}

export default withAuthentication(Search);
