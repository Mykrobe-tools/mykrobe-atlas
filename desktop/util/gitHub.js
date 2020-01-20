/* @flow */

require('isomorphic-fetch');

// load process.env from .env file (to set process.env.GH_TOKEN)
require('dotenv').config();
const pkg = require('../../package.json');

import debug from 'debug';
const d = debug('mykrobe:desktop-util');

export const GH_TOKEN = process.env.GH_TOKEN;

if (!GH_TOKEN) {
  throw `GitHub Personal Access Token is not set using env or dotenv "GH_TOKEN"`;
}

const defaultGitHubConfig = pkg.build.publish;

export const fetchGitHub = async (url: string): any => {
  const headers = {
    accept: 'application/vnd.github.v3+json',
    Authorization: `token ${GH_TOKEN}`,
  };
  d(`GitHub fetching ${url}`);
  const response = await fetch(url, { headers });
  const json = await response.json();
  return json;
};

export const fetchGitHubReleases = async (
  config: any = defaultGitHubConfig
): any => {
  const { owner, repo } = config;
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;
  return await fetchGitHub(url);
};
