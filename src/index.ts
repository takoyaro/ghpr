import { execSync, spawn, spawnSync } from 'child_process';
import { CREATED_PULL_REQUESTS } from './cmd';
import prompts from 'prompts';

const process = execSync(CREATED_PULL_REQUESTS);
const response = process.toString();
console.log(response);

interface PullRequest {
  title: string;
  updatedAt: string;
  url: string;
}

const result = JSON.parse(response) as PullRequest[];
const currentTime = (new Date()).getTime()
const recentData = result.filter(data => {
  const updatedAtUnix = new Date(data.updatedAt).getTime()
  return currentTime - updatedAtUnix < 86400 * 1000 // 24h
});
console.log(recentData)
function toMarked(data: PullRequest) {
  return `[${data.title}](${data.url})`
}

(async () => {
  const selected = await prompts([
    {
      type: 'multiselect',
      name: 'PR',
      message: 'Pick PRs',
      choices: recentData.map((d:PullRequest) => ({title: d.title, value: d})),
    }
  ])
  console.log(selected)
  // selected.PR.map(d => toMarked(d))
})();

//show recentData as select options