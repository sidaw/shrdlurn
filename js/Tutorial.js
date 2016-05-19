/**
 * Tutorial
 */

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

function mitmEnter(e) {
  if (e.keyCode == Hotkeys.ENTER) {
    e.preventDefault();
    e.stopPropagation();
    mitmDefine();
  }
  return true;
}

function mitmDoButton(e) {
  e.preventDefault();
  e.stopPropagation();
  mitmDefine();
}

function mitmDefine() {
  document.getElementById("show_define_status").className = "";
  updateStatus("SHRDLURN did not understand.");
  GS.query = document.getElementById("maintextarea").value;
  GS.coverage = [5, 5, 4, 0, 0, 0, 0];
  document.getElementById("tutorial-d1").className = "modal-container tutorial-s active";
}

document.getElementById("next_tutorial2").onclick = function() {
  document.getElementById("tutorial-s3").className = "tutorial-s";
  document.getElementById("maintextarea").value = "add orange except the border";
  document.getElementById("maintextarea").focus();
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";

  document.removeEventListener("keydown", parseKeys);
  document.getElementById("dobutton").removeEventListener("click", doQuery);
  document.addEventListener("keydown", mitmEnter, false);
  document.getElementById("dobutton").addEventListener("click", mitmDoButton, false);
};

document.getElementById("next_tutoriald2").addEventListener("click", function() {
  document.getElementById("tutorial-d1").className = "tutorial-s";
  document.removeEventListener("keydown", mitmEnter);
  document.getElementById("dobutton").removeEventListener("click", mitmDoButton);
  document.addEventListener("keydown", parseKeys, false);
  document.getElementById("dobutton").addEventListener("click", doQuery, false);
});

function mitmDefineEnter(e) {
  if (e.keyCode == Hotkeys.ENTER) {
    mitmDefinePhrase();
  }
  return true;
}

function mitmDefinePhraseClicked(e) {
  mitmDefinePhrase();
}

function mitmDefinePhrase() {
  document.getElementById("tutorial-s4").className = "modal-container tutorial-s active";
  document.removeEventListener("keydown", mitmDefineEnter);
  document.getElementById("define_phrase_button").removeEventListener("click", mitmDefinePhraseClicked);
  document.getElementById("define_phrase_button").addEventListener("click", definePhraseClicked, false);
  document.addEventListener("keydown", parseKeys, false);
  document.getElementById("definetextarea").value = "";
  closeDefineInterface(GS);
  document.getElementById("show_define_status").className = "hidden";
}

document.getElementById("next_tutoriald3").addEventListener("click", function() {
  document.getElementById("tutorial-d2").className = "tutorial-s";
  document.getElementById("define_phrase_button").removeEventListener("click", definePhraseClicked);
  document.removeEventListener("keydown", parseKeys);
  document.addEventListener("keydown", mitmDefineEnter, false);
  document.getElementById("define_phrase_button").addEventListener("click", mitmDefinePhraseClicked, false);
  document.getElementById("definetextarea").setAttribute("value", "add orange if row > 1 and col > 1 and row < 8 and col < 8");
  document.getElementById("definetextarea").focus();
})

document.getElementById("next_tutorial3").onclick = function() {
  document.getElementById("tutorial-s4").className = "tutorial-s";
  document.getElementById("maintextarea").value = "add orange except the border";
  document.getElementById("maintextarea").focus();
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
}

document.getElementById("next_tutorial4").onclick = function() {
  document.getElementById("tutorial-s5").className = "tutorial-s";
  document.getElementById("maintextarea").focus();
  GS.targetWall = "[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]";
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

var reference_links = document.getElementsByClassName("reference_link");
for (var i = 0; i < reference_links.length; i++) {
  reference_links[i].addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("reference").className = "modal-container";
  });
}

document.getElementById("reference_close").addEventListener("click", function() {
  document.getElementById("reference").className = "modal-container hidden";
});
