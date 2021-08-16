/* eslint-disable react/no-array-index-key */
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { NextSeo } from 'next-seo';
import classNames from 'classnames';
import { Transition } from '@headlessui/react';

import { fetchUsers } from '../lib/Store';
import Layout from '../components/Layout';
import { UserContext } from '../lib/UserContext';
import withAuthentication from '../HOCs/withAuthentication';
import Header from '../components/Header';
import SkeletonLoader from '../components/history/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Event from '../components/history/Event';
import { defaultOpacityTransition } from '../styles/defaults';
import { fetchHistory } from '../lib/queries/useHistory';

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
      <div className="px-4 py-8 h-full">
        <Header icon="📖" titleSmall="All the action" title="At your fingertips" />

        <SkeletonLoader show={history === null} />
        <Transition appear show={history?.length > 0} {...defaultOpacityTransition}>
          {history?.map((event, index) => {
            let date;
            const todayDate = dayjs().format('DD-MM-YYYY');

            if (event.date === todayDate) {
              date = 'Today';
            } else if (event.date === dayjs().subtract(1, 'day').format('DD-MM-YYYY')) {
              date = 'Yesterday';
            } else {
              date = dayjs(event.date).format('MMMM D');
            }

            return (
              <div className="flow-root" key={event.date}>
                <p
                  className={classNames('pb-3 font-medium', {
                    'pt-4': index > 0,
                  })}
                >
                  {date}
                </p>
                <ul className="-mb-8">
                  {event.history?.map((singleEvent, eventIdx) => (
                    <Event
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

        <EmptyState
          show={history?.length === 0}
          img={<img src="/void.svg" alt="Drawing of man looking into void" className="h-72" />}
          title="No history recorded yet"
          description="Events will appear here every time an item is added and removed from the list."
        />
      </div>
    </Layout>
  );
}

export default withAuthentication(History);
