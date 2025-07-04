// 记录页面加载时间(登机时间)
var boardingTime = new Date();

function updateFlightTimes() {
    window.setTimeout("updateFlightTimes()", 1000);
    
    var now = new Date();
    var seconds = 1000;
    var minutes = seconds * 60;
    
    // 计算候机时间(从页面加载到现在)
    var waitingTime = now - boardingTime;
    var waitingHours = Math.floor(waitingTime / (minutes * 60));
    var waitingMins = Math.floor((waitingTime % (minutes * 60)) / minutes);
    var waitingSecs = Math.floor((waitingTime % minutes) / seconds);
    
    // 计算起飞时间(页面加载后10秒)
    var takeoffTime = new Date(boardingTime.getTime() + 10000);
    var timeToTakeoff = takeoffTime - now;
    var takeoffHours = Math.floor(timeToTakeoff / (minutes * 60));
    var takeoffMins = Math.floor((timeToTakeoff % (minutes * 60)) / minutes);
    var takeoffSecs = Math.floor((timeToTakeoff % minutes) / seconds);
    
    // 更新时间显示
    document.getElementById("boarding-time").innerHTML = "登机时间: " + 
        boardingTime.toLocaleTimeString();
    document.getElementById("waiting-time").innerHTML = "候机时间: " + 
        waitingHours + "小时" + waitingMins + "分钟" + waitingSecs + "秒";
    document.getElementById("takeoff-time").innerHTML = "起飞倒计时: " + 
        takeoffHours + "小时" + takeoffMins + "分钟" + takeoffSecs + "秒";
    
    // 如果起飞时间已到
    if (timeToTakeoff <= 0) {
        document.getElementById("takeoff-time").innerHTML = "航班已起飞!";
        // 起飞后改为显示飞行时间
        var flightTime = now - takeoffTime;
        var flightHours = Math.floor(flightTime / (minutes * 60));
        var flightMins = Math.floor((flightTime % (minutes * 60)) / minutes);
        var flightSecs = Math.floor((flightTime % minutes) / seconds);
        document.getElementById("waiting-time").innerHTML = "飞行时间: " + 
            flightHours + "小时" + flightMins + "分钟" + flightSecs + "秒";
    }
}
updateFlightTimes();
