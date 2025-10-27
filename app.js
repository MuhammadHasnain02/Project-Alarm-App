// --------------<<< Current Time Display >>>--------------------

// Elements
let currentTime = document.getElementById("currentTime")

setInterval(() => {

    let now = new Date();
    let hrs = now.getHours();
    let mins = now.getMinutes();
    let secs = now.getSeconds();
    let ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    currentTime.innerText = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} ${ampm}`;

}, 1000);

// --------------<<< Alarm Functionality >>>------------------

// Elements
let alarmTime = document.getElementById("alarmTime")
let setAlarmBtn = document.getElementById("setAlarmBtn")
let delAlarmBtn = document.getElementById("delAlarmBtn")
// let alarmSound = document.getElementById("alarmSound")
let alarmList = document.getElementById("alarmList")

let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
renderAlarms();

// ------------ Set Alarm Button --------------

setAlarmBtn.addEventListener("click" , () => {
    
    // Full time
    let timeValue = alarmTime.value

    // Return empty hours & minutes
    if (!timeValue) return alert("Please select valid time!");

    // Separate hours & minutes
    let [hour , minute] = timeValue.split(":")
    hour = parseInt(hour)

    // AM & PM handling
    let ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12

    // Full time saved in alarms array
    let timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
    
    // Duplicate alarm check
    let alreadyExists = alarms.some(alarm => alarm.time === timeString);
    if (alreadyExists) return alert("⏰ This alarm already exists!");

    // Alarm add list (in object format)
    alarms.push({
        time: timeString,
        active: true,
        triggered: false
    });
    console.log(alarms);

    // Save to localStorage
    saveAlarms()

    // Render alarm list
    renderAlarms()

    // Empty alarm Input
    alarmTime.value = ""

})

function renderAlarms() {
    alarmList.innerHTML = ""

    if (alarms.length === 0) {

        let li = document.createElement("li")
        li.className = "flex justify-between items-center bg-white/10 border border-white/20 px-4 py-2 w-full rounded-lg";
        
        li.innerHTML = 
        `
        <i class="fa-solid fa-plus text-white"></i>
        <span class="text-lg font-bold text-gray-300">No Alarm</span>
        <i class="fa-regular fa-alarm-clock text-white"></i>
        `
        alarmList.appendChild(li)


    }

    alarms.forEach((alarm , i) => {
        
        let li = document.createElement("li")
        li.className = "flex justify-between items-center bg-white/10 border border-white/20 px-4 py-2 w-full rounded-lg";
        
        li.innerHTML = 
        `
        <i class="fa-regular fa-alarm-clock text-[20px] text-white hover:cursor-pointer duration-400 hover:scale-95"></i>
        <span class="text-lg font-bold text-gray-300">${alarm.time}</span>
        <div class="flex flex-row items-center space-x-2">

            <button onclick="toggleAlarm(${i})"" class="changeIcon text-[25px] text-gray-300 hover:cursor-pointer font-bold">
                <i class="fa-solid ${alarm.active ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
            </button>
            <button onclick="deleteAlarm(${i})" class="text-[19px] text-gray-300 duration-500 hover:scale-95 hover:cursor-pointer font-bold">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
        `
        alarmList.appendChild(li)

    });

}

// ------------ Toggle Alarm --------------

function toggleAlarm(index) {
    alarms[index].active = !alarms[index].active
    alarms[index].triggered = false

    saveAlarms();
    renderAlarms();
}

// ------------ Delete Alarm --------------

function deleteAlarm(index) {
    alarms.splice(index, 1);
    
    saveAlarms();
    renderAlarms();
}

// Utility Function → Save all alarms in localStorage
function saveAlarms() {
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

// --------------<<< Alarm Trigger >>>------------------

let alarmSound = new Audio(
  "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
);

setInterval(() => {

    let now = new Date();
    let hrs = now.getHours();
    let mins = now.getMinutes();
    let ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;

    let current = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;

    alarms.forEach(alarm => {
        
        if (alarm.active && alarm.time === current) {
            
            alarm.triggered = false
            saveAlarms()
            renderAlarms()

            // --- Play alarm sound ---
            alarmSound.currentTime = 0
            alarmSound.play()
    
            // --- Alert messages ---
            alert(`⏰ Alarm for ${current} is ringing!`);
    
            // --- Auto stop after 10s ---
            setTimeout(() => {
                
                alarmSound.pause()
                alarmSound.currentTime = 0
                alarm.active = false
                alarm.triggered = false
                renderAlarms();

            }, 10000);
    
        }

    });



}, 1000);
