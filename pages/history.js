/* eslint-disable react/no-array-index-key */
import { useContext, useEffect, useState } from 'react';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid';
import dayjs from 'dayjs';
import { NextSeo } from 'next-seo';
import classNames from 'classnames';
import { Transition } from '@headlessui/react';

import { fetchHistory, fetchUsers } from '../lib/Store';
import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import { UserContext } from '../lib/UserContext';

function History() {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState(null);
  const [allUsers, setAllUsers] = useState(null);

  useEffect(() => {
    fetchHistory(setHistory);
    fetchUsers(setAllUsers);
  }, []);

  return (
    <Layout>
      <NextSeo title="History | TKIT Shopping List" />
      <div className="px-4 py-8">
        <div className="space-y-4 pb-4">
          <div className="flex items-center">
            <p className="text-3xl pr-2">📋</p>
            <div className="truncate">
              <p className="font-medium text-gray-600 leading-4">Shopping list</p>
              <p className="text-3xl font-bold text-gray-800 sm:text-2xl truncate">History</p>
            </div>
          </div>
        </div>
        <Transition
          appear
          show={history == null}
          enter="transition ease-in duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {[...Array(3)].map((_, index) => (
            <div key={index + 15}>
              <div className="w-3/12 h-4 bg-gray-300 animate-pulse mb-3" />
              {[...Array(4)].map((__, historyIndex) => (
                <div className="relative pb-7" key={historyIndex}>
                  {historyIndex !== 3 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div className="h-8 w-8 bg-gray-300 rounded-full ring-8 ring-gray-100 flex items-center justify-center animate-pulse" />

                    <div className="flex flex-1 flex-col">
                      <div className="bg-gray-300 animate-pulse h-4 w-full mb-1.5" />
                      <div className="bg-gray-300 animate-pulse h-4 w-3/5" />
                    </div>

                    <div className="bg-gray-300 animate-pulse h-4 w-14" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Transition>
        <Transition
          appear
          show={history?.length === 0}
          enter="transition ease-in duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pt-3 flex flex-col items-center space-y-8">
            <div className="w-4/5 flex items-center justify-center mx-auto">
              <img
                src="/void.svg"
                alt="Drawing of a man looking into a black hole"
                className="max-w-full max-h-full w-full h-full"
              />
            </div>
            <div className="relative">
              <p className="text-center text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                No history recorded yet
              </p>
              <p className="mt-2 max-w-3xl mx-auto text-center text-gray-500">
                Events will appear here every time an item is added and removed from the list.
              </p>
            </div>
          </div>
        </Transition>
        <Transition
          appear
          show={history?.length > 0}
          enter="transition ease-in duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {history?.map((event, index) => {
            let date;

            if (event.date === dayjs().format('MM-DD-YYYY')) {
              date = 'Today';
            } else if (event.date === dayjs().subtract(1, 'day').format('MM-DD-YYYY')) {
              date = 'Yesterday';
            } else {
              date = dayjs(event.date).format('MMMM D');
            }

            return (
              <div className="flow-root" key={event.date}>
                <p
                  className={classNames('pb-3 font-medium', {
                    'pt-3': index > 0,
                  })}
                >
                  {date}
                </p>
                <ul className="-mb-8">
                  {event.history?.map((singleEvent, eventIdx) => (
                    <HistoryEvent
                      key={singleEvent.id}
                      eventIdx={eventIdx}
                      history={event.history}
                      event={singleEvent}
                      user={user}
                      users={allUsers}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </Transition>
      </div>
    </Layout>
  );
}

export default withAuthentication(History);

function HistoryEvent({ event, eventIdx, history, user, users }) {
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
      <div className="relative pb-7">
        {eventIdx !== history.length - 1 ? (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        ) : null}
        <div className="relative flex space-x-3">
          <div>
            {/* <span
              className={classNames(
                'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                {
                  'bg-red-600': event.event === 'delete',
                  'bg-sky-600': event.event === 'create',
                }
              )}
            >
              {event.event === 'delete' ? (
                <XIcon className="h-5 w-5 text-white" aria-hidden="true" />
              ) : (
                <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
              )}
            </span> */}
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
                <span className="font-medium text-gray-900">{event.itemName}</span> from the list
              </p>
            </div>
            <div className="text-right text-sm whitespace-nowrap text-gray-500">
              <time dateTime={event.createdAt}>
                {dayjs(event.createdAt).add(10, 'hour').format('h:mmA')}
              </time>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
