import React, { useState, useEffect, useCallback, Fragment } from 'react';
import Quagga, { CameraAccess } from '@ericblade/quagga2';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';
import { ExclamationIcon } from '@heroicons/react/outline';
import { ChevronLeftIcon } from '@heroicons/react/solid';

import Scanner from './Scanner';
// import CameraSelect from './CameraSelect';
import Modal from '../Modal';
import AlignmentCorner from '../icons/AlignmentCorner';

export default function BarcodeScanner({ open, setOpen }) {
  const router = useRouter();

  const [showingPermissionsPrompt, setShowingPermissionsPrompt] = useState(false);
  const [showNoPermissionsModal, setShowNoPermissionsModal] = useState(false);

  const [scannerStarted, setScannerStarted] = useState(false);
  const [stopScanner, setStopScanner] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [foundResult, setFoundResult] = useState(false);

  const [scannerRef, setScannerRef] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState();

  useEffect(() => {
    CameraAccess.enumerateVideoDevices().then((devices) => {
      const videoDevices = devices.filter((x) => x.kind === 'videoinput');
      let deviceHasLabel = false;
      videoDevices.forEach((device) => {
        if (device.label !== '' && !deviceHasLabel) deviceHasLabel = true;
      });
      setShowingPermissionsPrompt(!deviceHasLabel);
      setSelectedCamera(videoDevices[videoDevices.length - 1]);
    });
  }, []);

  useEffect(() => {
    if (scannerError && scannerError.toString().includes('Permission denied') && open) {
      setShowNoPermissionsModal(true);
    }
  }, [scannerError]);

  useEffect(() => {
    if (
      stopScanner &&
      (scannerStarted || scannerError || showingPermissionsPrompt || showNoPermissionsModal)
    ) {
      if (scannerStarted) {
        Quagga.stop();
        console.log('Quagga stopped');
      }
      if (scannerRef !== null) setScannerRef(null);
      if (scannerStarted) setScannerStarted(false);
      if (showNoPermissionsModal) setShowNoPermissionsModal(false);
      if (open) setOpen(false);
      if (showingPermissionsPrompt) setShowingPermissionsPrompt(false);
    }
    setStopScanner(false);
  }, [stopScanner]);

  useEffect(() => {
    if (!showingPermissionsPrompt && selectedCamera?.label === '' && !open) {
      setTimeout(() => {
        setShowingPermissionsPrompt(true);
      }, 250);
    }
  }, [showingPermissionsPrompt, open]);

  const updateScannerRef = useCallback((node) => {
    if (node !== null) {
      setScannerRef({ current: node });
    }
  }, []);

  return (
    <Fragment>
      <Modal open={open} setOpen={() => setStopScanner(true)}>
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
            {showingPermissionsPrompt ? (
              <div className="absolute inset-center w-full px-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-28 h-28 text-white mx-auto"
                >
                  <path
                    d="M18.5297 15.6817H19.2032V12.5583H20.234H3.76604H4.79701V15.6817H5.47056V12.5583H6.11244V14.7576H7.34323V12.5583H7.74085V14.7576H8.41439V12.5583H9.05605V14.7576H10.2866V12.5583H10.6847V14.7576H11.3582V12.5583H11.9997V14.7576H12.6732V12.5583H12.9547V14.7576H13.6283V12.5583H14.27V14.7576H15.5005V12.5583H15.8986V14.7576H16.5721V12.5583H17.2136V14.7576H17.8871V12.5583H18.5285V15.6817H18.5297ZM15.5014 8.76991H14.2709V11.2277H15.5014V8.76991ZM13.629 8.76991H12.9554V11.2277H13.629V8.76991ZM12.6739 8.76991H12.0003V11.2277H12.6739V8.76991ZM16.573 8.76991H15.8995V11.2277H16.573V8.76991ZM19.2032 8.76991H18.5297V11.2277H19.2032V8.76991ZM17.8882 8.76991H17.2147V11.2277H17.8882V8.76991ZM11.3589 8.76991H10.6854V11.2277H11.3589V8.76991ZM3.67354 15.0115H3V17.4516H5.47056V16.7863H3.67354V15.0115ZM10.2871 8.76991H9.0565V11.2277H10.2871V8.76991ZM18.5297 7V7.6653H20.3265V9.44031H21V7H18.5297ZM5.47056 11.2277V8.76991H4.79701V11.2277H5.47056ZM20.3265 16.7861H18.5297V17.4514H21V15.0115H20.3265V16.7861ZM8.41462 8.76991H7.74107V11.2277H8.41462V8.76991ZM7.34346 8.76991H6.11267V11.2277H7.34346V8.76991ZM3.67354 7.6653H5.47056V7H3V9.44031H3.67354V7.6653Z"
                    fill="currentColor"
                  />
                  <line
                    x1="3.76001"
                    y1="11.89"
                    x2="20.24"
                    y2="11.89"
                    stroke="#0284C7"
                    strokeWidth="0.67"
                  />
                </svg>
                <div className="text-center -mt-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-50">Scan a barcode</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 px-2">
                      You can save time finding products by using your devices camera as a barcode
                      scanner
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-5 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-offset-black focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:col-start-2 sm:text-sm transition"
                  onClick={() => setShowingPermissionsPrompt(false)}
                >
                  Enable camera access
                </button>
              </div>
            ) : (
              <div
                ref={updateScannerRef}
                className="relative w-full h-full flex-1 flex items-center justify-center"
              >
                <canvas className="hidden drawingBuffer" width="640" height="480" />

                <div className="w-full px-11 h-52 absolute inset-center">
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
                    modalOpen={open}
                    onDetected={(result) => {
                      if (result && !foundResult) {
                        setFoundResult(true);
                        setStopScanner(true);
                        window.navigator.vibrate(200);
                        router.push(`/search/${result}`);
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
            )}
          </div>
        </div>
      </Modal>
      <Modal open={showNoPermissionsModal} setOpen={() => setStopScanner(true)}>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
              <ExclamationIcon className="h-6 w-6 text-orange-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                Camera access required
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Please allow list.tkit.app to access the camera on your deivce. This permission
                  can be found in your browser settings.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 sm:text-sm transition"
              onClick={() => setStopScanner(true)}
            >
              Close scanner
            </button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
