const { readGithub, record } = require("./records.cjs");
const reviewOpenActions = ["opened", "ready_for_review"];
function isReviewOpenAction(action) {
  return reviewOpenActions.some((candidate) => candidate === action);
}
async function readReviewablePull(options) {
  const { clone } = options;
  const pull = await readGithub({
    request: options.request,
    route: `GET /repos/${clone.repository}/pulls/${options.number}`
  });
  const author = String(record(pull.user).login);
  const head = record(pull.head);
  if (pull.draft === true || !clone.requesters.includes(author) || author.endsWith("[bot]") || record(head.repo).id !== clone.repositoryId) {
    return null;
  }
  return { actor: author, version: String(head.sha) };
}

module.exports = { isReviewOpenAction, readReviewablePull };
