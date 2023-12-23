'use strict';

const ENV = {
  prod: 'production',
  dev: 'development',
  test: 'test',
};

const MIME_TYPES = {
  default: 'application/octet-stream',
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
  json: 'application/json',
  txt: 'text/plain',
};

const HEADERS = {
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=UTF-8',
};

module.exports = {
  MIME_TYPES,
  HEADERS,
  ENV,
};
