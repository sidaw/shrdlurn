import { getParameterByName } from "./util"
import Strings from "constants/strings"
import Targets from "constants/targets"

export function getTurkId() {
  const mturkid = getParameterByName("mturkid");
  if (mturkid) return mturkid;
  return Strings.DEFAULT_SESSIONID;
}

export function getTurkCode(targetIdx, nSteps, nBlocks) {
  const mturkid = getTurkId();
  const encodedData = window.btoa(unescape(encodeURIComponent(`${mturkid}:win:${targetIdx}:${nSteps}:${nBlocks}:Yummy`)));
  return encodedData;
}

export function getTurkHit() {
  const hitnum = getParameterByName("mhitid");
  if (hitnum && hitnum < Targets.length) return hitnum;
  return 0;
}
