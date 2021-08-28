/* eslint-disable react/no-array-index-key */
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { NextSeo } from 'next-seo';
import classNames from 'classnames';
import { Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../components/Layout';
import withAuthentication from '../HOCs/withAuthentication';
import Header from '../components/Header';
import SkeletonLoader from '../components/history/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import Event from '../components/history/Event';
import { defaultOpacityTransition } from '../styles/defaults';
import { fetchAllUsers } from '../redux/slices/userSlice';
import { fetchAllHistory } from '../redux/slices/historySlice';

function History() {
  const dispatch = useDispatch();
  const { user, users } = useSelector((state) => state.user);
  const { history } = useSelector((state) => state.history);

  useEffect(() => {
    dispatch(fetchAllHistory());
    dispatch(fetchAllUsers());
  }, []);

  console.log(history);

  return (
    <Layout>
      <NextSeo title="History | TKIT Shopping List" />
      <div className="px-4 py-8 h-full">
        <Header icon="📖" titleSmall="All the action" title="At your fingertips" />

        <SkeletonLoader show={history === null} />
        <Transition appear show={history?.length > 0} {...defaultOpacityTransition}>
          {history?.map((event, index) => {
            let date;
            const todayDate = dayjs().format('YYYY-MM-DD');

            if (event.date === todayDate) {
              date = 'Today';
            } else if (event.date === dayjs().subtract(1, 'day').format('YYYY-MM-DD')) {
              date = 'Yesterday';
            } else {
              date = dayjs(event.date).format('MMMM D');
              // date = 'cunt';
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
                      users={users}
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
