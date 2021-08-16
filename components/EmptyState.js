import { Transition } from '@headlessui/react';
import { defaultOpacityTransition } from '../styles/defaults';

export default function EmptyState({ show, img, title, description }) {
  return (
    <Transition
      show={show}
      appear
      {...defaultOpacityTransition}
      className="flex flex-col items-center justify-center flex-1"
    >
      <div className="flex items-center justify-center mx-auto">{img}</div>
      <div>
        <p className="mt-3 text-center text-2xl leading-8 font-extrabold tracking-tight text-gray-900">
          {title}
        </p>
        {description && (
          <p className="mt-2 max-w-3xl mx-auto text-center text-gray-500">{description}</p>
        )}
      </div>
    </Transition>
  );
}
