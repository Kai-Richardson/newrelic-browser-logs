# New Relic Browser Logging Test Project

## Setup

`npm i`
`npm run dev`

## Ways to Authenticate with New Relic

1. You can insert the `jsConfig` into `public/config/newrelic-config.json` and it will be used to create the newrelic agent instance.
2. You can copy-paste the snippet into `index.html` and that will create it.

## To see it actually working

Set the dependency to `"@newrelic/browser-agent": "=1.282.0",`
Things will suddenly magically work.
