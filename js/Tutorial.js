/**
 * Tutorial
 */

window.addEventListener("load", function() {
  var tutorial_token = util.store.getItem("tutorial_token");
  if (!tutorial_token) {
    begin_tutorial();
  }
});


document.getElementById("start_tutorial2").addEventListener("click", function(e) {
  e.preventDefault();
  begin_tutorial();
  start_tutorial();
});

function begin_tutorial() {
    document.getElementById("tutorial").className = "tutorial active";
    document.getElementById("canvastarget").className = "active";
    document.getElementById("goalblocks").className = "active";
    document.getElementById("quit_tutorial").className = "";
    document.getElementById("tutorial-s1").className = "modal-container tutorial-s active";
    loadGameState(GS, "[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]");
    PS.Main.renderTargetJSON("[[[4],[4],[4],[4],[4],[4],[4],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,3,2,2],[4,2,2],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4],[4],[4],[4],[4],[4],[4],[4],[4]]]")();
    GS.tutorialMode = true;
    GS.maxSteps = 100;
    document.getElementById("recipe_steps").innerHTML = "(" + 0 + "/" + GS.maxSteps + ")";
}

function nextTutorial(i) {
  document.getElementById("tutorial-s" + (i - 1)).className = "tutorial-s";
  document.getElementById("tutorial-s" + i).className = "cover-container tutorial-s active";
  GS.tutorialLevel++;
}

document.getElementById("skip_tutorial").onclick = function() {
  util.store.setItem("tutorial_token", "true");
  document.getElementById("tutorial").className = "tutorial";
}

function addCover(id) {
  document.getElementById(id).setAttribute("style", "position:relative;z-index:1000;");
}

function addAbsCover(id) {
  document.getElementById(id).setAttribute("style", "z-index:10000;");
}

function removeCover(id) {
  document.getElementById(id).setAttribute("style", "");
}

document.getElementById("start_tutorial").addEventListener("click", start_tutorial);


function start_tutorial() {
  document.getElementById("tutorial_overlay").className = "";
  document.getElementById("maintextarea").focus();
  addCover("maintextarea");
  addCover("mainbuttons");
  addCover("canvastarget");
  addCover("quit_tutorial");
  nextTutorial(2);
  document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
  window.addEventListener("keydown", keyTutorial);
}

function keyTutorial(e, tutorial_id) {
  if (!GS.tutorialMode)
    return true;

  switch (GS.tutorialLevel) {
    case 3:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 4:
      if (e.keyCode == Hotkeys.ENTER && e.shiftKey)
        prepNextTutorial();
      break;
    case 5:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 6:
      if (e.keyCode == Hotkeys.D && (e.ctrlKey || e.metaKey))
        prepNextTutorial();
      break;
    case 7:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 8:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 9:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 10:
      if (e.keyCode == Hotkeys.ENTER && e.shiftKey)
        prepNextTutorial();
      break;
    case 11:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 12:
      if (e.keyCode == Hotkeys.D && (e.ctrlKey || e.metaKey))
        prepNextTutorial();
      break;
    case 13:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 14:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 15:
      if (e.keyCode == Hotkeys.ENTER)
        prepNextTutorial();
      break;
    case 16:
      if (e.keyCode == Hotkeys.ENTER && e.shiftKey)
        prepNextTutorial();
      break;
    default:

  }

  return true;
}

function prepNextTutorial(e) {
  console.log(GS.tutorialLevel);
  switch (GS.tutorialLevel) {
    case 3:
      if (GS.query != "add yellow") {
        alert("Oops! You typed the wrong query. Check your spelling.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(3);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      break;
    case 4:
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      nextTutorial(4);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 5:
      if (GS.query != "add orange except the border") {
        alert("Oops! You typed the wrong query. Check your spelling.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(5);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("show_define_status").className = "";
      addAbsCover("show_define_status");
      document.getElementById("paraphrase").addEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").addEventListener("click", prepNextTutorial);
      break;
    case 6:
      document.getElementById("paraphrase").removeEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      removeCover("show_define_status");
      nextTutorial(6);
      addCover("define_interface");
      // document.getElementById("define_try").addEventListener("click", prepNextTutorial);
      break;
    case 7:
      if (document.getElementById("definetextarea").value != "add orange if row > 1 and col > 1 and row < 8 and col < 8") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      addCover("canvas");
      //document.getElementById("define_try").removeEventListener("click", prepNextTutorial);
      nextTutorial(7);
      document.getElementById("define_phrase_button").addEventListener("click", prepNextTutorial);
      break;
    case 8:
      if (document.getElementById("definetextarea").value != "add orange if row > 1 and col > 1 and row < 8 and col < 8") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("definetextarea").value = "";
      document.getElementById("define_phrase_button").removeEventListener("click", prepNextTutorial);
      removeCover("define_interface");
      removeCover("canvas");
      closeDefineInterface(GS);
      updateStatus("definition accepted. thanks for teaching!");
      nextTutorial(8);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 9:
      if (GS.query != "add orange except the border") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(9);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      break;
    case 10:
      document.getElementById("flyingaccept").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      nextTutorial(10);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 11:
      if (GS.query != "add 2 red if col  =  4 or col  =  5") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(11);
      addCover("canvas");
      addAbsCover("metaactions");
      addAbsCover("show_define_status");
      document.getElementById("paraphrase").addEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").addEventListener("click", prepNextTutorial);
      break;
    case 12:
      document.getElementById("paraphrase").removeEventListener("click", prepNextTutorial);
      document.getElementById("define_instead").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      removeCover("show_define_status");
      nextTutorial(12);
      addCover("define_interface");
      // document.getElementById("define_try").addEventListener("click", prepNextTutorial);
      break;
    case 13:
      if (document.getElementById("definetextarea").value != "repeat add red if col = 4 or col = 5 2 times") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      addCover("canvas");
      // document.getElementById("define_try").removeEventListener("click", prepNextTutorial);
      nextTutorial(13);
      document.getElementById("define_phrase_button").addEventListener("click", prepNextTutorial);
      break;
    case 14:
      if (document.getElementById("definetextarea").value != "repeat add red if col = 4 or col = 5 2 times") {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("definetextarea").value = "";
      document.getElementById("define_phrase_button").removeEventListener("click", prepNextTutorial);
      removeCover("define_interface");
      removeCover("canvas");
      closeDefineInterface(GS);
      updateStatus("definition accepted. thanks for teaching!");
      nextTutorial(14);
      addCover("maintextarea");
      addCover("mainbuttons");
      document.getElementById("dobutton").addEventListener("click", prepNextTutorial);
      break;
    case 15:
      if (!(GS.query == "add 2 red if col  =  4 or col  =  5" || GS.query == "add 2 red if col   =   4 or col   =   5")) {
        alert("Oops! You typed the wrong query. Check for typos.");
        return true;
      }
      document.getElementById("dobutton").removeEventListener("click", prepNextTutorial);
      removeCover("maintextarea");
      removeCover("mainbuttons");
      nextTutorial(15);
      addCover("canvas");
      addAbsCover("metaactions");
      document.getElementById("flyingaccept").addEventListener("click", prepNextTutorial);
      break;
    case 16:
      document.getElementById("flyingaccept").removeEventListener("click", prepNextTutorial);
      removeCover("canvas");
      removeCover("metaactions");
      removeCover("quit_tutorial");
      window.removeEventListener("keydown", keyTutorial);
      document.getElementById("tutorial_overlay").className = "hidden";
      document.getElementById("tutorial-s15").className = "tutorial-s";
      document.getElementById("tutorial-s16").className = "modal-container tutorial-s active";
      GS.tutorialLevel++;
      break;
    default:
  }
  return true;
}


document.getElementById("quit_tutorial").addEventListener("click", function() {
  finishTutorial();
});

function finishTutorial() {
  util.store.setItem("tutorial_token", true);
  document.getElementById("tutorial").className = "tutorial";
  document.getElementById("canvastarget").className = "";
  document.getElementById("goalblocks").className = "";
  removeCover("quit_tutorial");
  document.getElementById("quit_tutorial").className = "hidden";
  GS.tutorialMode = false;
  document.getElementById("clear_button").click();
  new_target();
}

document.getElementById("finish_tutorial").onclick = function() {
  finishTutorial();
}

var reference_links = document.getElementsByClassName("reference_link");
for (var i = 0; i < reference_links.length; i++) {
  reference_links[i].addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("reference").className = "modal-container";
  });
}

document.getElementById("reference_close").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("reference").className = "modal-container hidden";
});