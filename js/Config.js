"use strict"
var configs = {};
if (configs.SEMPRE_URL==undefined)
    configs.SEMPRE_URL = "http://jonsson.stanford.edu:8401"
// configs.SEMPRE_URL = "http://localhost:8400"

configs.costPerStep = 3;
configs.costPerScroll = 1;

configs.defaultMaxSteps = 3;
configs.hardMaxSteps = false; // not allowing num steps to exceed this

configs.maximumNbest = 42;
configs.debugMode = false;

configs.levels = []

configs.levels.push({
    id: "randomworld",
    name: "random",
    maxSteps: 1,
    description: "",
    minSuccess: 5
})

configs.levels.push({
    id: "emptyworld",
    name: "empty",
    maxSteps: 1,
    description: "",
    minSuccess: 5
})
