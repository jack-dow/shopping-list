import React, { useState, useRef, useEffect } from 'react';
import { CameraAccess } from '@ericblade/quagga2';
import { Dialog } from '@headlessui/react';

import Layout from '../components/Layout';
import Scanner from '../components/BarcodeScanner/Scanner';
import Result from '../components/BarcodeScanner/Result';
// import CameraSelect from '../components/BarcodeScanner/CameraSelect';
import Modal from '../components/Modal';
import AlignmentCorner from '../components/icons/AlignmentCorner';
import { fetchProductsFromSearch } from '../redux/services/woolworths';

const Barcode = () => {
  const [scanningModalOpen, setScanningModalOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  let scannerReady = false;
  // const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState();
  const [product, setProduct] = useState();
  const scannerRef = useRef(null);

  useEffect(() => {
    CameraAccess.enumerateVideoDevices().then((devices) => {
      const videoDevices = devices.filter((x) => x.kind === 'videoinput');
      console.log(devices);
      setSelectedCamera(videoDevices[videoDevices.length - 1]);
    });
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      fetchProductsFromSearch(results[0], setProduct);
    }
  }, [results]);

  useEffect(() => {
    if (!scanning && scanningModalOpen) {
      setScanningModalOpen(false);
    }
  }, [scanning]);

  return (
    <Layout>
      <div className="px-4 py-4">
        <button
          type="button"
          onClick={() => {
            if (results.length > 0) {
              setResults([]);
            }
            setScanningModalOpen(!scanningModalOpen);
            setTimeout(() => {
              setScanning(true);
            }, 1);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition"
        >
          {scanningModalOpen ? 'Stop' : 'Start'}
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
      </div>

      <Modal
        open={scanningModalOpen}
        setOpen={() => {
          if (scannerReady) {
            setScanning(false);
            scannerReady = false;
          }
        }}
      >
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="text-center flex items-center justify-center flex-col overflow-hidden sm:mt-5">
              <div>
                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                  Scan barcode
                </Dialog.Title>
              </div>
            </div>
          </div>
          <div ref={scannerRef} className="mt-4 relative flex items-center overflow-hidden">
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
            <canvas className="hidden drawingBuffer" width="640" height="480" />
            {scanning && (
              <Scanner
                scannerRef={scannerRef}
                onDetected={(result) => {
                  setScanning(!scanning);
                  setResults([...results, result]);
                  window.navigator.vibrate(200);
                }}
                scanning={scanning}
                onScannerReady={() => {
                  scannerReady = true;
                  console.log('set scanner ready');
                }}
                constraints={{ width: '640', height: '480' }}
                // facingMode="environment"
                cameraId={selectedCamera?.deviceId}
              />
            )}
          </div>
          {/* <div className="text-left w-full z-10 mt-2">
            {cameras.length > 0 && (
              <CameraSelect
                selected={selectedCamera}
                setSelected={(selected) =>
                  setSelectedCamera(cameras.find(({ label }) => label === selected))
                }
                cameras={cameras}
              />
            )}
          </div> */}

          <div className="mt-4 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 transition sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={() => {
                if (scannerReady) {
                  setScanning(false);
                  scannerReady = false;
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Barcode;
