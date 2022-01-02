import * as Sentry from '@sentry/node';

// import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: 'https://9e6d07ebc04c444594a39827796188ab@o1103807.ingest.sentry.io/6130396',
  tracesSampleRate: 1.0,
});

// const transaction = Sentry.startTransaction({
//   op: "test",
//   name: "My First Test Transaction",
// });

// setTimeout(() => {
//   try {
//     foo();
//   } catch (e) {
//     Sentry.captureException(e);
//   } finally {
//     transaction.finish();
//   }
// }, 99);
