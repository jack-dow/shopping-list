import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

import Modal from '../../Modal';

export default function DetailedProductModal({ open, setOpen, product }) {
  const cancelButtonRef = useRef(null);

  const [showingFullDescription, setShowingFullDescription] = useState(false);
  const [sanitizedDescription, setSanitizedDescription] = useState();

  useEffect(() => () => {
    setShowingFullDescription(false);
  });

  useEffect(() => {
    if (product?.additionalAttributes?.description)
      setSanitizedDescription(sanitizeHtml(product.additionalAttributes.description));
  }, [product]);

  return (
    <Modal open={open} setOpen={setOpen} initialFocus={cancelButtonRef}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div className="flex items-center justify-center">
            <img src={product?.largeImageFile} alt={product?.displayName} className="h-[319px]" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <div>
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                {product?.displayName}
              </Dialog.Title>
              <p className="text-sm text-gray-400 font-medium">{product?.cupString}</p>
            </div>

            <p className="text-lg text-sky-600 font-medium">
              $
              {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
                .format(product?.price)
                .substring(1)}
            </p>

            <div className="mt-2">
              <p
                className="text-sm text-gray-500"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizedDescription?.substring(
                    0,
                    showingFullDescription ? sanitizedDescription.length : 220
                  ),
                }}
              />
              {sanitizedDescription?.length > 220 && (
                <button
                  type="button"
                  onClick={() => setShowingFullDescription(!showingFullDescription)}
                  className="text-sm text-sky-600 transition hover:underline focus:underline focus:no-outline"
                >
                  {showingFullDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 transition sm:mt-0 sm:col-start-1 sm:text-sm"
            onClick={() => setOpen(false)}
            ref={cancelButtonRef}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
