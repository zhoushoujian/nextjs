import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Meta from '@/pages/meta';
import { updateText } from '@/store/common';
import useFetch from '@/hooks/use-fetch';
import * as Style from './index.less';

const colors = ['#fff', '#ff0', '#f00', '#f0f', '#0ff', '#00f', '#0f0'];

type IProps = {
  text: string;
};

const Main = ({ text }: IProps) => {
  const seconds = useRef(3);
  const { start: startFunc } = useFetch({ waitForStart: true });

  useEffect(() => {
    const secondsInterval = setInterval(() => {
      if (seconds.current <= 0) {
        window.$dispatch(updateText('Click me!'));
        clearInterval(secondsInterval);
      }
      const result = seconds.current - 1;
      seconds.current = result;
    }, 1000);
  }, []);

  const changeColor = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors[Math.floor(Math.random() * colors.length)]);
    startFunc({
      url: '/api',
      method: 'get',
      onSuccess: res => {
        console.log('api res', res);
      },
      onError: error => {
        console.error('api error', error);
      },
    });
  };

  return (
    <div>
      <Meta TITLE='index' META_DESCRIPTION='META_DESCRIPTION' META_KEYWORDS='META_KEYWORDS' noIndex={false} />
      <div className={Style.container}>
        <div className={Style.calculator}>
          <div className={Style.blueball}>
            <div className={Style.blueball1}></div>
            <div className={Style.blueball2}></div>
            <div className={Style.text} onClick={changeColor}>
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Main.getInitialProps = ({ req, res }) => {
  if (req) {
    return {
      data: res ? res.data : null,
    };
  }
  return window.__NEXT_DATA__.props.pageProps;
};

const mapStateToProps = state => {
  return {
    text: state.common.text,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
