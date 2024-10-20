// app.js
// Create a posting schedule and it's slackbot commands
// Charles Wu

function getEventName(){
    let eventName = document.getElementById("eventInput").value.trim();
    return eventName;
}

function getDates(){
    let dates = document.getElementById("dateInput").value.trim();
    dates = dates.split(" ");
    return dates;
}

function getPosters(){
    let names = document.getElementById("namesInput").value.trim();
    names = names.split(",").map(name => name.trim()); //split the names by comma
    return names;
}

function makeSchedule(eventName, dates, posters){
    let schedule = "";
    let dateIndex = 0;
    let dailyPosters = [];

    schedule += "Event Title: " + eventName + "\n" +
        "Schedule: \n";

    shuffleArray(posters)

    for (let i = 0; i < dates.length; i++){
        // crate an emty string for each line of posters
        dailyPosters.push("");
    }
    while (posters.length != 0){
        // add posters to each line ( creating schedule by adding a poster to each day at a time)
        dailyPosters[dateIndex] += "@" + posters[0] + " ";
        posters.shift()

        if (dateIndex < dates.length - 1){
            dateIndex++
        }
        else{
            dateIndex = 0
        }
    }

    // reverse the order so there's more posters when it's closer to the event
    dailyPosters.reverse()

    for (let i = 0; i < dates.length; i++){
       schedule += dates[i] + ": " + dailyPosters[i] + "\n";
    }

    return schedule
}

function scheduleToSlackCommands(schedule, eventName){
    let remindTime = "10am";
    let dailySchedule = schedule.split("\n");
    let text = "";

    // remove the 2 first lines (event name and "Schedule:")
    dailySchedule.shift()
    dailySchedule.shift()
    dailySchedule.pop()

    for (let i = 0; i < dailySchedule.length; i++){
        dailySchedule[i] = dailySchedule[i].split(":"); // create a list where index 0 is the date and index 1 is the names
        let names = dailySchedule[i][1].trim() // divide names inside the list
        names = names.split(" ")
        dailySchedule[i][1] = names

        // create a command for each date
        text += `/remind @channel \" ${names.map((name => ' ' + name + ' '))}Please make a post about ${eventName} today. 11am-2pm are recommended.\" at ${remindTime} ${dailySchedule[i][0]} \n`
    }
    return text;
}

function displayOutput(){
    let eventName = getEventName();
    let dates = getDates();
    let posters = getPosters();
    let scheduleOutput = document.getElementById("scheduleOutput");
    let slackbotCommandsOutput = document.getElementById("slackMessagesOutput") ;
    let schedule = makeSchedule(eventName, dates, posters);
    let commands = scheduleToSlackCommands(schedule,eventName)
    scheduleToSlackCommands(schedule)
    slackbotCommandsOutput.innerHTML = commands
    scheduleOutput.innerHTML = schedule;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i]; 
        array[i] = array[j];
        array[j] = temp;
    }
}

let eventNameInput = document.getElementById("eventInput")
let dates = document.getElementById("dateInput")
let names = document.getElementById("namesInput")
eventNameInput.addEventListener("keyup", displayOutput)
dates.addEventListener("keyup", displayOutput)
names.addEventListener("keyup", displayOutput)


displayOutput()
