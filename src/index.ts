#!/usr/bin/env node
import { execSync, spawn, spawnSync } from 'child_process';
import { CREATED_PULL_REQUESTS, REQUESTED_REVIEW } from './cmd';
import prompts from 'prompts';

interface PullRequest {
  title: string;
  updatedAt: string;
  url: string;
}

const currentTime = (new Date()).getTime()
const createdPRs = getPullRequests(CREATED_PULL_REQUESTS)
const reviewPRs = getPullRequests(REQUESTED_REVIEW);


(async () => {
  const selectedPRs = [];
  
  const createdOptions = getRecents(createdPRs).map((d:PullRequest) => ({title: d.title, value: d}));
  if (createdOptions && createdOptions.length > 0) {
    const selectedCreated = await prompts([
      {
        type: 'multiselect',
        name: 'PR',
        message: 'Your PRs',
        choices: getRecents(createdPRs).map((d:PullRequest) => ({title: d.title, value: d})),
      }
    ]);
    selectedPRs.push(...selectedCreated.PR);
  }
  
  const reviewsOptions = getRecents(reviewPRs).map((d:PullRequest) => ({title: d.title, value: d}));
  if (reviewsOptions && reviewsOptions.length > 0) {
    const selectedReviews = await prompts([
      {
        type: 'multiselect',
        name: 'PR',
        message: 'waiting for your Review',
        choices: reviewsOptions
      }
    ]);
    selectedPRs.push(...selectedReviews.PR)
  }
  
  const marked = (selectedPRs as PullRequest[]).map(d => toMarked(d))
  console.log(marked.join(`\r\n`));
})();


function getPullRequests(cmd: string) {
  const process = execSync(cmd);
  const response = process.toString();
  return JSON.parse(response) as PullRequest[];
}

function getRecents(prs: PullRequest[]) {
  return prs.filter(pr => {
    const updatedAtUnix = new Date(pr.updatedAt).getTime()
    return currentTime - updatedAtUnix < 86400 * 1000 // 24h
  });
}

function toMarked(pr: PullRequest) {
  return `[${pr.title}](${pr.url})`
}