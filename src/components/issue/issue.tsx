import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import DropdownItem from '../dropDown';
import EditIssueArea from '~/routes/editIssue';
import SearchItem from '../search';
import IssueDashBoard from '~/components/IssueDashBoard';
import { FloatButton } from 'antd';
// import Spinner from '~/components/spinner/spinner';
import NoData from '../noData';
import { useAllIssueStore } from '~/store/userStore';
import { setIssuePageStore } from '~/store/issueStore';
import './issue.scss';
import { gsap } from 'gsap-trial';
import ScrollTrigger from 'gsap-trial/ScrollTrigger';
import ScrollSmoother from 'gsap-trial/ScrollSmoother';

interface IAllIssue {
  repoAllIssues: {
    title: string;
    number: number;
    label: {
      name: string;
      description: string;
    };
    body: string;
    created_at: Date;
  }[];
}

const IssueItem = () => {
  const params = useParams();
  const { name } = params;
  const [pageNum, setPageNum] = useState(1);
  const { getRepoAllIssues, repoAllIssues, setLoading, dataStatus } = useAllIssueStore(
    (state) => state,
  );
  const { issuePageNumber, setIssuePageNumber } = setIssuePageStore((state) => state);
  useEffect(() => {
    setLoading();
    getRepoAllIssues(
      {
        repo: name,
        params: {
          sort: 'created',
          order: 'desc',
          per_page: 10,
          page: issuePageNumber,
        },
        noCache: false,
      },
      'page',
    );
  }, [issuePageNumber]);

  const el = useRef();
  const q = gsap.utils.selector(el);
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      smoothTouch: 0.1,
    });
    return () => {
      smoother.kill();
    };
  }, []);

  const { loading, hasNextPage } = dataStatus;

  const issueObserver = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (post) => {
      if (loading) return;

      if (issueObserver.current) issueObserver.current.disconnect();

      issueObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log('We are near the last post!');
          setIssuePageNumber(issuePageNumber + 1);
        }
      });

      if (post) issueObserver.current.observe(post);
    },
    [loading, hasNextPage],
  );
  const dropDownOption = [
    {
      label: 'All',
      value: '',
    },
    {
      label: 'Open',
      value: 'Open',
    },
    {
      label: 'In progress',
      value: 'In progress',
    },
    {
      label: 'Done',
      value: 'Done',
    },
  ];
  const createIssueProp = {
    button: 'Add Issue',
    number: 0,
  };
  const Content = () => {
    return (
      <div className='issue-item'>
        {repoAllIssues &&
          repoAllIssues?.map((post, i) => {
            if (repoAllIssues.length === i + 1) {
              return <IssueDashBoard key={i} ref={lastPostRef} post={post} />;
            }
            return <IssueDashBoard key={i} post={post} />;
          })}
        {!hasNextPage && <div className='issue-section__no-more'>No more data available!</div>}
      </div>
    );
  };
  return (
    <div className='issue-section' ref={el} id='smooth-wrapper'>
      <div className='issue-section__header'>
        <DropdownItem dropDownOption={dropDownOption} />
        <SearchItem />
        <EditIssueArea issueProp={createIssueProp} />
      </div>
      <div id='smooth-content'>{repoAllIssues.length ? <Content /> : <NoData />}</div>
      <FloatButton.BackTop />
    </div>
  );
};

export default IssueItem;
