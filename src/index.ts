import { spawn } from 'child_process';
import prompt from 'prompt';
import { CREATED_PULL_REQUESTS } from './cmd';

prompt.start();

const process = spawn(CREATED_PULL_REQUESTS[0],[CREATED_PULL_REQUESTS[1]]);
process.stdout.on('data',(data:string)=>{
    console.log(data)
})


interface PullRequest {
  title: string;
  updatedAt: string;
  url: string;
}

const result = JSON.parse(response) as PullRequest[];
const currentTime = (new Date()).getTime()
const recentData = result.filter(data => {
  const updatedAtUnix = new Date(data.updatedAt).getTime()
  return currentTime - updatedAtUnix < 86400 // 24h
});
// show recentData as select options