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

function makeSchedule(eventName, dates, posters) {
    let schedule = "";
    let dailyPosters = [];

    schedule += "Event Title: " + eventName + "\n" +
        "Schedule: \n";

    shuffleArray(posters);

    // Initialize empty strings for each date
    for (let i = 0; i < dates.length; i++) {
        dailyPosters.push(""); 
    }

    // Create an index for the posters
    let posterIndex = 0;

    while (posterIndex < posters.length) {
        // Only add a poster if there are names left
        if (dailyPosters[Math.floor(posterIndex / dates.length)]) {
            // Get the current date index
            let dateIndex = posterIndex % dates.length;
            // Add the current poster with an '@'
            if (dailyPosters[dateIndex] !== "") {
                dailyPosters[dateIndex] += ", "; // Add a comma only if there are names already
            }
            dailyPosters[dateIndex] += "@" + posters[posterIndex]; // Add the name
        }
        posterIndex++;
    }

    // Reverse the order to give more posters closer to the event
    dailyPosters.reverse();

    // Build the schedule output
    for (let i = 0; i < dates.length; i++) {
        if (dailyPosters[i].trim() !== "") {
            schedule += dates[i] + ": " + dailyPosters[i].trim() + "\n"; // Only add lines that have content
        } else {
            schedule += dates[i] + ": No posters assigned\n"; // Optional: show no posters if empty
        }
    }

    return schedule;
}


function scheduleToSlackCommands(schedule, eventName){
    let remindTime = "10am";
    let dailySchedule = schedule.split("\n");
    let text = "";

    // Remove the first two lines (event name and "Schedule:") and the last empty line
    dailySchedule.shift();
    dailySchedule.shift();
    dailySchedule.pop();

    for (let i = 0; i < dailySchedule.length; i++){
        dailySchedule[i] = dailySchedule[i].split(":"); // Create a list where index 0 is the date and index 1 is the names
        let names = dailySchedule[i][1].trim(); // Trim the list of names

        // Split by commas and trim the names
        let trimmedNames = names.split(",").map(name => name.trim()).filter(name => name !== "");

        // Create a command for each date only if there are names
        if (trimmedNames.length > 0) {
            text += `/remind @channel "${trimmedNames.map(name => ' ' + name).join('')}. Please make a post about ${eventName} today. 11am-2pm are recommended." at ${remindTime} ${dailySchedule[i][0]} \n`;
        }
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
