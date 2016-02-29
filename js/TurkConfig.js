
var configs = {};
if (configs.SEMPRE_URL==undefined)
    configs.SEMPRE_URL = "http://jonsson.stanford.edu:8400"
configs.SEMPRE_URL = "http://localhost:8400"

configs.costPerStep = 3;
configs.costPerScroll = 1;

configs.defaultMaxSteps = 3;
configs.hardMaxSteps = true; // not allowing num steps to exceed this

configs.maximumNbest = 42;
configs.debugMode = false;

configs.levels = []
configs.levels.push({
    id: "remove",
    name: "basics",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "babystep",
    name: "babysteps",
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
    id: "babynot",
    name: "babynot",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
configs.levels.push({
    id: "babystack",
    name: "stacks",
    maxSteps: 2,
    description: "",
    minSuccess: 10
})
