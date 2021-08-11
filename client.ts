import next from 'next';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const client = next({
  dev: process.env.NODE_ENV !== 'production',
  dir: './app',
});

export default client;
