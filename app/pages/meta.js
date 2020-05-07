import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

const Meta = (props) => {
    const {
        TITLE="",
        META_DESCRIPTION="",
        META_KEYWORDS="",
        noIndex=false,
    } = props;

    return (
      <Head>
        <title>{TITLE}</title>
        {META_DESCRIPTION && ( <meta name="description" content={META_DESCRIPTION} />)}
        <meta name="author" content="" />
        {META_KEYWORDS && (<meta name="keywords" content={META_KEYWORDS} />)}
        {noIndex && (<meta name="robots" content="noindex, follow" />)}
      </Head>
    );
};

export default connect(null, null)(Meta);
