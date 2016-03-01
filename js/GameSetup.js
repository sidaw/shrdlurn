// jack the simpleid function when mturkid is present
if (util.parseQueryString()["user"]) {
    util.getId = function()
    {
	return util.parseQueryString()["user"];
    }
}

GS.sessionId = util.getId();
GS.successCounts = util.getStore("successCounts", {})
GS.extraBits = util.getStore("extraBits", 0)
popTasks();
document.getElementById("flyingdiv").style.visibility="visible";
document.getElementById("goalblocks").style.visibility="visible";
newWall(GS);
document.getElementById("maintextarea").focus();
