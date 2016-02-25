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
    id: "baby",
    name: "baby",
    maxSteps: 2,
    description: "come back here to train more when struggling",
    minSuccess: 15
})
configs.levels.push({
    id: "baby+",
    name: "baby+",
    maxSteps: 2,
    description: "",
    minSuccess: 15
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
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "fork",
    name: "fork",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "ship",
    name: "ship",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "bottle",
    name: "bottle",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})
configs.levels.push({
    id: "triangle",
    name: "triangle",
    maxSteps: 4,
    description: "",
    minSuccess: 2
})

