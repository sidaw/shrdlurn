// jack the simpleid function when a user is present
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
newWall(GS);
document.getElementById("maintextarea").focus();
