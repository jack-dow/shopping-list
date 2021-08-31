import React, { useState, useRef, useEffect, useCallback } from 'react';
import Quagga, { CameraAccess } from '@ericblade/quagga2';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronLeftIcon } from '@iconicicons/react';

import Layout from '../components/Layout';
import Scanner from '../components/BarcodeScanner/Scanner';
import Result from '../components/BarcodeScanner/Result';
// import CameraSelect from '../components/BarcodeScanner/CameraSelect';
import Modal from '../components/Modal';
import AlignmentCorner from '../components/icons/AlignmentCorner';
import { fetchProductsFromSearch } from '../redux/services/woolworths';
import { defaultOpacityTransition } from '../styles/defaults';

const Barcode = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  // const [scannerStarting, setScannerStarting] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);
  const [stopScanner, setStopScanner] = useState(false);
  const [scannerRef, setScannerRef] = useState(null);
  const [scannerError, setScannerError] = useState(null);

  const [results, setResults] = useState([]);

  // const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState();
  const [product, setProduct] = useState();

  useEffect(() => {
    CameraAccess.enumerateVideoDevices().then((devices) => {
      const videoDevices = devices.filter((x) => x.kind === 'videoinput');

      setSelectedCamera(videoDevices[videoDevices.length - 1]);
    });
  }, []);

  useEffect(() => {
    if (results.length > 0 && !product) {
      // fetchProductsFromSearch(results[0], setProduct);
    }
  }, [results]);

  const updateScannerRef = useCallback((node) => {
    if (node !== null) {
      setScannerRef({ current: node });
    }
  }, []);

  useEffect(() => {
    if (stopScanner && (scannerStarted || scannerError)) {
      Quagga.stop();
      setScannerRef(null);
      console.log('Quagga stopped');
      setStopScanner(false);
      setScannerStarted(false);
      setScannerOpen(false);
    } else {
      setStopScanner(false);
    }
  }, [stopScanner]);

  return (
    <Layout>
      <div className="px-4 py-4">
        <button
          type="button"
          onClick={() => {
            if (results.length > 0) {
              setResults([]);
            }
            setScannerOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
        >
          {scannerOpen ? 'Stop' : 'Start'}
        </button>
        <button
          type="button"
          onClick={() => {
            Quagga.stop();
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
        >
          Stop
        </button>

        <ul className="results">
          {results.map(
            (result) => result.codeResult && <Result key={result.codeResult.code} result={result} />
          )}
          {results.map((result) => (
            <li>{result}</li>
          ))}
          {product?.length > 0 && <div>{product[0].displayName}</div>}
          {results.length === 0 && 'No results yet'}
        </ul>
        <Modal open={scannerOpen} setOpen={() => setStopScanner(true)}>
          <div className="absolute top-0 right-0 w-screen h-screen bg-black">
            <div className="w-full h-full relative">
              <button
                type="button"
                onClick={() => setStopScanner(true)}
                className="absolute z-[99] top-4 left-4 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {/* <Transition
                show={!scannerStarted}
                {...defaultOpacityTransition}
                className="w-full h-full bg-black z-[999]"
              /> */}
              <div ref={updateScannerRef} className="relative w-full h-full flex-1">
                <canvas className="hidden drawingBuffer" width="640" height="480" />

                <div className="w-full px-8 h-2/5 absolute inset-center">
                  <div className="w-full h-full relative">
                    <div className="absolute top-0 left-0 text-white">
                      <AlignmentCorner className="w-6 h-6" />
                    </div>
                    <div className="absolute bottom-0 left-0 text-white">
                      <AlignmentCorner className="w-6 h-6 transform -rotate-90" />
                    </div>
                    <div className="absolute top-0 right-0 text-white transform rotate-90">
                      <AlignmentCorner className="w-6 h-6" />
                    </div>
                    <div className="absolute bottom-0 right-0 text-white transform rotate-180">
                      <AlignmentCorner className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {scannerRef?.current && (
                  <Scanner
                    scannerRef={scannerRef}
                    modalOpen={scannerOpen}
                    onDetected={(result) => {
                      console.log(result);
                      if (result) {
                        window.navigator.vibrate(200);
                        setResults([...results, result]);
                        setStopScanner(true);
                      }
                    }}
                    scannerStarted={scannerStarted}
                    onScannerReady={() => setScannerStarted(true)}
                    onError={(err) => setScannerError(err)}
                    constraints={{
                      width:
                        scannerRef.current.clientWidth > scannerRef.current.clientHeight
                          ? scannerRef.current.clientWidth
                          : scannerRef.current.clientHeight,
                      height:
                        scannerRef.current.clientWidth > scannerRef.current.clientHeight
                          ? scannerRef.current.clientHeight
                          : scannerRef.current.clientWidth,
                    }}
                    facingMode="environment"
                    cameraId={selectedCamera?.deviceId}
                  />
                )}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Barcode;
