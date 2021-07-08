import Layout from '../components/Layout';

function Offline() {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center">
        <div className="pt-3 flex flex-col items-center space-y-8">
          <div className="w-2/3 flex items-center justify-center mx-auto">
            <img
              src="/void.svg"
              alt="Drawing of a man looking into the void"
              className="max-w-full max-h-full w-full h-full"
            />
          </div>
          <div className="relative px-4">
            <p className="text-center text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Connect to the internet
            </p>
            <p className="mt-2 max-w-3xl mx-auto text-center text-gray-500">
              You&apos;re offline. Check your connection and try again
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Offline;
