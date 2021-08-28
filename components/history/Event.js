import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function Event({ event, eventIdx, history, user, users }) {
  const [eventUser, setEventUser] = useState(null);

  useEffect(() => {
    if (event.user === user.id) {
      setEventUser('You');
    } else {
      setEventUser(users?.find((u) => u.id === event.user).name);
    }
  }, [users]);

  return (
    <li key={event.id}>
      <div className="relative pb-8">
        {eventIdx !== history.length - 1 ? (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        ) : null}
        <div className="relative flex space-x-3">
          <div>
            <div className="h-8 w-8 bg-white rounded-full ring-8 ring-gray-100 flex items-center justify-center">
              {event.event === 'create' ? (
                <PlusCircleIcon className="h-5 w-5 text-sky-600" aria-hidden="true" />
              ) : (
                <MinusCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1 flex justify-between space-x-4">
            <div>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{eventUser}</span>
                {event.event === 'create' ? ' added ' : ' removed '}
                <span className="font-medium text-gray-900">{event.name}</span>
                {event.event === 'create' ? ' to' : ' from'} the list
              </p>
            </div>
            <div className="text-right text-sm whitespace-nowrap text-gray-500">
              <time dateTime={event.createdAt}>{dayjs(event.createdAt).format('h:mmA')}</time>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
