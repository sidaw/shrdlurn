"use strict"
var configs = {};
if (configs.SEMPRE_URL==undefined)
    configs.SEMPRE_URL = "http://jonsson.stanford.edu:8400"
// configs.SEMPRE_URL = "http://localhost:8400"

configs.costPerStep = 3;
configs.costPerScroll = 1;

configs.defaultMaxSteps = 3;
configs.hardMaxSteps = true; // not allowing num steps to exceed this

configs.maximumNbest = 42;
configs.debugMode = false;

configs.levels = []
configs.levels.push({
    id: "remove",
    name: "baby",
    maxSteps: 1,
    description: "come back here to train more when struggling",
    minSuccess: 10
})
configs.levels.push({
    id: "stack",
    name: "baby+",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "pattern",
    name: "patterns",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "littlehouse",
    name: "house",
    maxSteps: 3,
    description: "",
    minSuccess: 4
})
configs.levels.push({
    id: "checker",
    name: "checker",
    maxSteps: 4,
    description: "",
    minSuccess: 4
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
    name: "logic",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "triangle",
    name: "triangle",
    maxSteps: 3,
    description: "",
    minSuccess: 4
})
configs.levels.push({
    id: "heart",
    name: "heart",
    maxSteps: 3,
    description: "",
    minSuccess: 1
})
