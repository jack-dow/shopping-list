import { useCallback, useLayoutEffect, useState } from 'react';
import Quagga from '@ericblade/quagga2';

function getMedian(arr) {
  arr.sort((a, b) => a - b);
  const half = Math.floor(arr.length / 2);
  if (arr.length % 2 === 1) {
    return arr[half];
  }
  return (arr[half - 1] + arr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes) {
  const errors = decodedCodes.filter((x) => x?.error !== undefined).map((x) => x?.error);
  const medianOfErrors = getMedian(errors);
  return medianOfErrors;
}

const defaultLocatorSettings = {
  patchSize: 'medium',
  halfSample: true,
};

const defaultDecoders = ['ean_reader', 'ean_8_reader'];

const Scanner = ({
  onDetected,
  scannerRef,
  onScannerStarting,
  onScannerReady,
  onScannerStopped,
  scannerStarted,
  onError,
  cameraId,
  facingMode,
  constraints,
  locator = defaultLocatorSettings,
  numOfWorkers = navigator.hardwareConcurrency || 0,
  decoders = defaultDecoders,
  locate = true,
}) => {
  const [hasInit, setHasInit] = useState(false);
  let errorOccured = false;

  const errorCheck = useCallback(
    (result) => {
      if (!onDetected) {
        return;
      }

      const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
      // if Quagga is at least 90% certain that it read correctly, then accept the code.
      if (err < 0.1) {
        onDetected(result.codeResult.code);
      }
    },
    [onDetected]
  );

  useLayoutEffect(() => {
    if (!hasInit) {
      setHasInit(true);
      try {
        Quagga.init({
          inputStream: {
            type: 'LiveStream',
            constraints: {
              ...constraints,
              ...(cameraId && { deviceId: cameraId }),
              ...(!cameraId && { facingMode }),
              // aspectRatio: 16 / 9,
            },
            target: scannerRef.current,
          },
          locator,
          numOfWorkers,
          decoder: { readers: decoders, multiple: false },
          locate,
        })
          .catch((err) => {
            errorOccured = true;
            if (onError) onError(err);

            return console.log('Quagga error occured: ', err);
          })
          .then(() => {
            if (!errorOccured) {
              Quagga.start();
              console.log('Quagga started');

              if (onScannerReady) onScannerReady();
            }
          });
      } catch (error) {
        return;
      }

      Quagga.onDetected(errorCheck);
    }
  }, [
    cameraId,
    onDetected,
    onScannerStarting,
    onScannerReady,
    onScannerStopped,
    scannerStarted,
    scannerRef,
    errorCheck,
    constraints,
    locator,
    decoders,
    locate,
  ]);

  return null;
};

export default Scanner;
