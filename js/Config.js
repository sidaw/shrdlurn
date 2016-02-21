"use strict"
var configs = {};
if (configs.SEMPRE_URL==undefined)
    configs.SEMPRE_URL = "http://jonsson.stanford.edu:8400"

configs.costPerStep = 3;
configs.costPerScroll = 1;

configs.defaultMaxSteps = 3;
configs.hardMaxSteps = true; // not allowing num steps to exceed this

configs.maximumNbest = 42;
configs.debugMode = true;

configs.levels = []
configs.levels.push({
    id: "remove",
    name: "baby steps*",
    maxSteps: 1,
    description: "come back here to train more when struggling"
})
configs.levels.push({
    id: "stack",
    name: "more blocks*",
    maxSteps: 1,
    description: ""
})
configs.levels.push({
    id: "castle",
    name: "castle",
    maxSteps: 1,
    description: ""
})
configs.levels.push({
    id: "checker2castle",
    name: "checker and castle",
    maxSteps: 2,
    description: ""
})
configs.levels.push({
    id: "tallcastle",
    name: "tall castle",
    maxSteps: 3,
    description: ""
})
configs.levels.push({
    id: "checker",
    name: "checker",
    maxSteps: 4,
    description: ""
})

if (false) {
configs.levels.push({
    id: "remove2",
    name: "just top*",
    maxSteps: 1,
    description: ""
})
configs.levels.push({
    id: "removeall",
    name: "ambiguity*",
    maxSteps: 1,
    description: ""
})}

configs.levels.push({
    id: "logic",
    name: "logic*",
    maxSteps: 2,
    description: ""
})
configs.levels.push({
    id: "triangle",
    name: "triangle",
    maxSteps: 3,
    description: ""
})

