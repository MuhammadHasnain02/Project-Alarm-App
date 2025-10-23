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

let alarmList = document.getElementById("alarmList")
let alarms = []

setAlarmBtn.addEventListener("click" , () => {
    
    // Full time
    let timeValue = alarmTime.value

    // Separate hours & minutes
    let [hour , minute] = timeValue.split(":")
    hour = parseInt(hour)

    // Return empty hours & minutes
    if (!timeValue) return alert("Please select valid time!");
    
    // AM & PM handling
    let ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12

    // Full time saved in alarms array
    let timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
    alarms.push(timeString);
    console.log(alarms);

    renderAlarms()

    // empty alarm Input
    alarmTime.value = ""

})

function renderAlarms() {

    alarmList.innerHTML = ""

    alarms.forEach((alarm , i , iconClass) => {
        
        let li = document.createElement("li")
        li.className = "flex justify-between items-center bg-white/10 border border-white/20 px-4 py-2 w-full rounded-lg";
        
        li.innerHTML = 
        `
        <span class="text-lg font-bold text-gray-300">${alarm}</span>
        <div class="flex flex-row items-center space-x-2">
            <button class="changeIcon text-2xl text-gray-300 hover:cursor-pointer font-bold">
                <i class="fa-solid fa-toggle-on"></i>
            </button>
            <button onclick="deleteAlarm(${i})" class="text-gray-300 hover:text-gray-400 hover:cursor-pointer font-bold">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        `
        alarmList.appendChild(li)

        let changeIcon = document.querySelectorAll(".changeIcon")
        changeIcon.forEach(btn => {

            btn.addEventListener("click" , () => {
                
                if (btn.children[0].classList.contains("fa-toggle-on")) {
                    btn.children[0].classList.replace("fa-toggle-on" , "fa-toggle-off")
                }
                else {
                    btn.children[0].classList.replace("fa-toggle-off" , "fa-toggle-on")
                }
    
            })

        });

    });

}

function deleteAlarm(index) {
    alarms.splice(index, 1);
    console.log(alarms);
    renderAlarms();
}

// --------------<<< Alarm Trigger >>>------------------

setInterval(() => {

    let now = new Date();
    let hrs = now.getHours();
    let mins = now.getMinutes();
    let ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;

    let current = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;

    if (alarms.includes(current)) {

        alert(`⏰ Alarm for ${current} is ringing!`);

        setTimeout(() => {
            alert(`⏰ Reminder 2 for ${current}`);
        }, 5000);

        // 10 seconds baad last alert
        setTimeout(() => {
            alert(`⏰ Final Reminder for ${current}`);
        }, 10000);

        alarms = alarms.filter(a => a !== current);
        renderAlarms();

    }

}, 1000);
