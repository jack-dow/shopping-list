import Link from 'next/link';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';

function Test() {
  // const router = useRouter();

  return (
    <Layout>
      <div>Im a layout!</div>
      <Link href="/barcode">
        <a
          href="/barcode"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
        >
          Go to barcode page
        </a>
      </Link>
    </Layout>
  );
}

export default withAuthentication(Test);
