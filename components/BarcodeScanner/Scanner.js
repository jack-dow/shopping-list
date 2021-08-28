import { useCallback, useLayoutEffect } from 'react';
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
  onScannerReady,
  onError,
  cameraId,
  facingMode,
  constraints,
  scanning,
  locator = defaultLocatorSettings,
  numOfWorkers = navigator.hardwareConcurrency || 0,
  decoders = defaultDecoders,
  locate = true,
}) => {
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
    if (scannerRef && scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              ...constraints,
              ...(cameraId && { deviceId: cameraId }),
              ...(!cameraId && { facingMode }),
            },
            target: scannerRef.current,
          },
          locator,
          numOfWorkers,
          decoder: { readers: decoders, multiple: false },
          locate,
        },
        // eslint-disable-next-line consistent-return
        (err) => {
          if (err) {
            if (onScannerReady) onScannerReady();
            if (onError) onError(err);
            return console.log('Error starting Quagga:', err);
          }

          if (scannerRef && scannerRef.current && scanning) {
            Quagga.start();
            console.log('quagga started');

            if (onScannerReady) onScannerReady();
          }
        }
      );

      Quagga.onDetected(errorCheck);
    }

    return () => {
      console.log('quagga stopped');

      Quagga.offDetected(errorCheck);
      Quagga.stop();
    };
  }, [
    cameraId,
    onDetected,
    onScannerReady,
    scanning,
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
