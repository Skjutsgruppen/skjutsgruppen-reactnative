## Prerequisites

1. react-native

```
$ npm install -g react-native-cli
```

2. For Android 
- Download Android SDK from  here https://developer.android.com/studio/index.html#command-tools


## Install
```
$ git clone git@gitlab.yipl.com.np:web-apps/skjutsgruppen.git
$ cd skjutsgruppen
$ yarn install
$ cp .env.example .env .env.production
```
Update .env config according to your need.

## For Android
### List all avds
```
$ cd /path/to/Android/Sdk/tools
$ ./emulator --list-avds
```
### Run app on android emulator
```
$ ./emulator -avd <ADV_NANE>
$ yarn start
$ yarn android
```
## Upgrade React Native version
Install react-native-git-upgrade package globally

```
$ npm install -g react-native-git-upgrade
$ react-native-git-upgrade
```

## Style Guide
This project uses [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
So please read and be familiar with their style guide before contributing on this project.

## Lint javscript code
Run eslint before you commit changes.

```
yarn eslint
```
