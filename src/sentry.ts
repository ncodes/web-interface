import * as Sentry from "@sentry/react";
import { isLocal } from "./libs/helpers";

Sentry.init({
  enabled: !isLocal(),
  dsn: "https://e58314a261e90f717ede3add86ae842b@o4506660089823232.ingest.sentry.io/4506660095459328",
  integrations: [
    new Sentry.BrowserTracing({}),

    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: false,
    }),
  ],
  tracePropagationTargets: [
    "localhost",
    "https://dev.joint.exchange/v1",
    "https://api.joint.exchange/v1",
    "https://rpc.sepolia.org",
  ],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
