# 👨‍🔬 vew-reader

An experimental reader prototype for [Value-Enabled Web](https://github.com/seetee-io/value-enabled-web).

This protoype makes use of [`vew-api`](https://github.com/seetee-io/vew-api), running at [`https://vat.monocle.cnixbtc.com/api`](https://vat.monocle.cnixbtc.com/api) for bringing articles into a readable format.

## How to Run

### Regtest Backend

For local testing, you can make use of the dockerized accounts backend in `/docker/regtest/`.
It runs the following software:

- A Bitcoin Core node in regtest
- An LND node in regtest representing the main node holding the funds of readers
- LNDHUB as an accounting layer for this LND node.
- A second LND node in regtest representing the node of an author
- A lightning address server for this author node hosting the lighting address `author@localhost:3001`

To run the regtest backend:

- `cd docker/regtest`
- `docker compose up`

Then when everythign is running:

- `./setup-regtest.sh`

The setup script will fund the main LND node and open a channel to the author node so we can pay the author using their lightning address.

If you get any errors in the setup script yelling at you that RPC APIs are not ready yet or that servers are still starting up, just wait for a minute and try again.
This just means that Bitcoin Core or LND have not fully started up yet.

### Mobile App

The prototype app uses [React Native](https://reactnative.dev).
Have a look at [_Setting up the Development Environment_](https://reactnative.dev/docs/environment-setup) for how to get stup developing with React Native.

Once setup, run:

- `npx react-native start` to start the JS bundler; and in a separate terminal
- `npx react-native run-ios`; or
- `npx react-native run-android` to start the application
