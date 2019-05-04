# RSS Reader

[![Build Status](https://travis-ci.org/GarrySh/rss-reader.svg?branch=master)](https://travis-ci.org/GarrySh/rss-reader)
[![Maintainability](https://api.codeclimate.com/v1/badges/5f7b15f53d415352398e/maintainability)](https://codeclimate.com/github/GarrySh/rss-reader/maintainability)

[Demo version](https://garrysh.github.io/rss-reader/)

## Requirements

- Node.JS, tested with version 10.13
- Yarn

## Setup

```sh
git clone https://github.com/GarrySh/rss-reader rss-reader
cd rss-reader
rm -rf .git
git init
make install
```

## Run in development mode

```sh
make start
```

## Build a production version in 'dist' folder

```sh
make build
```

## Compile and deploy to github-pages

```sh
make deploy
```
