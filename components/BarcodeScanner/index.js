import React, { useState, useRef, useEffect } from 'react';
import { CameraAccess } from '@ericblade/quagga2';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';
import { ExclamationIcon } from '@heroicons/react/outline';

import Scanner from './Scanner';
// import CameraSelect from './CameraSelect';
import Modal from '../Modal';
import AlignmentCorner from '../icons/alignmentCorner';

export default function BarcodeScanner({ open, setOpen }) {
  const router = useRouter();

  const [scanning, setScanning] = useState();
  const [selectedCamera, setSelectedCamera] = useState();

  const [scannerError, setScannerError] = useState(null);
  let scannerReady = false;

  const scannerRef = useRef(null);

  // Get list of cameras and set the selected camera to the last one
  useEffect(() => {
    CameraAccess.enumerateVideoDevices().then((devices) => {
      const videoDevices = devices.filter((x) => x.kind === 'videoinput');

      setSelectedCamera(videoDevices[videoDevices.length - 1]);
    });
  }, []);

  useEffect(() => {
    if (open && !scanning) {
      setTimeout(() => {
        setScanning(true);
      }, 10);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      setOpen={() => {
        if (scannerReady || scannerError) {
          scannerReady = false;
          setScannerError(null);
          setScanning(false);
          setTimeout(() => {
            setOpen();
          }, 10);
        }
      }}
    >
      <div className="inline-block w-full align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div className="text-center flex items-center justify-center flex-col overflow-hidden sm:mt-5">
            <div>
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                Scan barcode
              </Dialog.Title>
            </div>
          </div>
        </div>
        {scannerError && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Attention Required</h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>You must enable camera permissions to use this feature.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          ref={scannerRef}
          className="mt-4 flex relative items-center overflow-hidden w-full flex-1"
        >
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
          {scanning && !scannerError && (
            <Scanner
              scannerRef={scannerRef}
              onDetected={(result) => {
                if (result) {
                  window.navigator.vibrate(200);
                  setScanning(false);
                  setTimeout(() => {
                    setOpen();
                  }, 1);
                  window.navigator.vibrate(200);
                  router.push(`/search/${result}`);
                }
              }}
              onScannerReady={() => {
                scannerReady = true;
              }}
              scanning={scanning}
              onError={(err) => {
                setScannerError(err);
              }}
              constraints={{ width: '640', height: '480' }}
              facingMode="environment"
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
              if (scannerReady || scannerError) {
                scannerReady = false;
                setScanning(false);
                setScannerError(null);
                setTimeout(() => {
                  setOpen();
                }, 10);
              }
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
