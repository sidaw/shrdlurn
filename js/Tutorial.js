
// Tutorial
window.addEventListener("load", function() {
  var tutorial_token = localStorage.getItem("tutorial_token");
  if (!tutorial_token) {
    document.getElementById("tutorial").className = "tutorial active";
    document.getElementById("canvastarget").className = "active";
    document.getElementById("goalblocks").className = "active";
    document.getElementById("states").className = "states";
    PS.Main.renderTargetJSON("[[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]]")();
    GS.tutorialMode = true;
  } else {
    document.getElementById("states").className = "states active";
  }
})

function nextTutorial(i) {
  console.log(i);
  document.getElementById("tutorial-s" + (i - 1)).className = "tutorial-s";
  document.getElementById("tutorial-s" + i).className = "modal-container tutorial-s active";
}

document.getElementById("skip_tutorial").onclick = function() {
  localStorage.setItem("tutorial_token", "true");
  document.getElementById("tutorial").className = "tutorial";
}

document.getElementById("start_tutorial").onclick = function() { nextTutorial(2); }

document.getElementById("next_tutorial1").onclick = function() {
  document.getElementById("tutorial-s2").className = "tutorial-s";
  document.getElementById("maintextarea").focus();
  var taskstr = configs.levels[1].name;
  GS.taskind = 1;
  newWall(GS);
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
}

document.getElementById("next_tutorial2").onclick = function() {
  document.getElementById("tutorial-s3").className = "tutorial-s";
  document.getElementById("maintextarea").focus();
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
}

document.getElementById("next_tutorial3").onclick = function() {
  document.getElementById("tutorial-s4").className = "tutorial-s";
  document.getElementById("maintextarea").focus();
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2,0],[4,3,2,0],[4,3,2],[4,3],[4],[4],[4,3],[4,3,2],[4,3,2],[4,3,2],[4,3,2],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
}

document.getElementById("finish_tutorial").onclick = function() {
  localStorage.setItem("tutorial_token", true);
  document.getElementById("tutorial").className = "tutorial";
  document.getElementById("canvastarget").className = "";
  document.getElementById("goalblocks").className = "";
  document.getElementById("states").className = "";
  GS.tutorialMode = false;
  document.getElementById("states").className = "states active";
}
