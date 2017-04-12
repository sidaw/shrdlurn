import React from "react"
import targets from "constants/targets"
import Hashids from "hashids"
import { getTurkHit } from "helpers/turk"

export function emojione(num) {
  const emojioneList = {
    ":scream:": ["1f631"],
    ":astonished:": ["1f632"],
    ":confused:": ["1f615"],
    ":rolling_eyes:": ["1f644"],
    ":relieved:": ["1f60c"],
    ":relaxed:": ["263a"],
    ":neutral_face:": ["1f610"],
    ":slight_smile:": ["1f642"],
    ":smiley:": ["1f603"],
    ":grinning:": ["1f600"],
  };

  const numToShort = {
    6: ":scream:",
    5: ":astonished:",
    4: ":confused:",
    3: ":rolling_eyes:",
    2: ":relieved:",
    1: ":relaxed:",
    0: ":smiley:",
  };

  const imagePathPNG = "http://cdn.jsdelivr.net/emojione/assets/png/";
  const imagePathSVG = "http://cdn.jsdelivr.net/emojione/assets/svg/";
  // const cacheBustParam = "";
  const imageType = "png"; // png or svg

  const shortname = numToShort[num];
  const unicode = emojioneList[shortname][emojioneList[shortname].length - 1];
  const alt = shortname;

  let replaceWith = "";
  if (imageType === "png") {
    replaceWith = <img class="emojione" alt={alt} src={`${imagePathPNG}${unicode}.png`} />
  } else {
    replaceWith = <object class="emojione" data={`${imagePathSVG}${unicode}.svg`} type="image/svg+xml" standby={alt}>alt</object>
  }

  return replaceWith;
}

export function setStore(name, value) {
  const jsonValue = JSON.stringify(value);
  localStorage.setItem(name, jsonValue);
}

export function getStore(name, defaultValue = "") {
  const value = localStorage.getItem(name);
  if (!value) {
    return defaultValue;
  }
  return JSON.parse(value);
}

export function resetStore() {
  localStorage.clear();
}

export function genTarget() {
  const usedTargets = getStore("usedTargetsv1", []);
  if (usedTargets.length === targets.length) {
    alert("You've completed all targets! Resetting...");
    setStore("usedTargetsv1", []);
  }

  let targetIdx = -1;
  do {
    targetIdx = Math.floor(Math.random() * targets.length);
  } while (usedTargets.includes(targetIdx));

  // turk override
  const mhitid = getTurkHit();
  if (mhitid != null) targetIdx = mhitid;

  return [targetIdx, ...targets[targetIdx]];
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function rand10000() {
  return Math.ceil(Math.random() * 10000)
}

export function genUid() {
  const hashids = new Hashids("our cool SHRDLURN salt")
  return hashids.encode(rand10000(), rand10000(), rand10000(), rand10000(), rand10000())
}

export function genSid() {
  const hashids = new Hashids("our cool SHRDLURN salt for sids")
  return hashids.encode(rand10000(), rand10000())
}

function drawImage(canvas, ctx, img, width, height) {
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL("image/png")
}

export function resizePNG(dataImg, width, height) {
  const data = document.querySelector("#blocksCanvas").toDataURL("image/png")

  // create an off-screen canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // set its dimension to target size
  canvas.width = width;
  canvas.height = height;

  // draw source image into the off-screen canvas:
  const img = new Image()
  img.src = data

  // encode image to data-uri with base64 version of compressed image sync
  return new Promise((resolve, reject) => {
    if (img.complete) {
      resolve(drawImage(canvas, ctx, img, width, height))
    }

    img.onload = () => {
      resolve(drawImage(canvas, ctx, img, width, height))
    }
  })
}