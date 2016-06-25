export function getHistoryElems() {
  return document.querySelectorAll("#command_history > div[data-type='accept'], #command_history > div[data-type='initial']");
}
