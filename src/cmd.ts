export const CREATED_PULL_REQUESTS = `gh pr list -A "@me" -s all --json title,url,updatedAt`;
export const REQUESTED_REVIEW = `gh pr list -S "user-review-requested:@me" -s all --json title,url,updatedAt`;

