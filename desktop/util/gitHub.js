/* @flow */

// load process.env from .env file
require('dotenv').config();
const pkg = require('../../package.json');

require('isomorphic-fetch');

export const GH_TOKEN = process.env.GH_TOKEN;

if (!GH_TOKEN) {
  throw `GitHub Personal Access Token is not set using env "GH_TOKEN"`;
}

const gitHubConfig = pkg.build.publish;
const { owner, repo } = gitHubConfig;

export const fetchGitHub = async () => {
  const url = `https://api.github.com/repos/${gitHubConfig.owner}/${
    gitHubConfig.repo
  }/releases`;
  const headers = {
    accept: 'application/vnd.github.v3+json',
    Authorization: `token ${GH_TOKEN}`,
  };
  console.log(JSON.stringify({ url, headers }));
  // return new Promise((resolve, reject) => {
  //   request.get(
  //     {
  //       url: url,
  //       json: true,
  //       headers,
  //     },
  //     (err, res, data) => {
  //       if (err) {
  //         reject(err);
  //       } else if (res.statusCode !== 200) {
  //         reject('Status:', res.statusCode);
  //       } else {
  //         // data is already parsed as JSON:
  //         resolve(data.html_url);
  //       }
  //     }
  //   );
  // });
  const response = await fetch(url, { headers });
  const json = await response.json();
  console.log('json', JSON.stringify(json, null, 2));
};

//        return await this.githubRequest(`/repos/${this.info.owner}/${this.info.repo}/releases/${release.id}`, this.token, null, "DELETE")

/*
private githubRequest<T>(path: string, token: string | null, data: {[name: string]: any; } | null = null, method?: "GET" | "DELETE" | "PUT"): Promise<T> {
    // host can contains port, but node http doesn't support host as url does
    const baseUrl = parseUrl(`https://${this.info.host || "api.github.com"}`)
    return parseJson(httpExecutor.request(configureRequestOptions({
      hostname: baseUrl.hostname,
      port: baseUrl.port as any,
      path: (this.info.host != null && this.info.host !== "github.com") ? `/api/v3${path.startsWith("/") ? path : `/${path}`}` : path,
      headers: {accept: "application/vnd.github.v3+json"}
    }, token, method), this.context.cancellationToken, data))
  }
  */
