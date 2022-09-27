
//The two buttons that will appear on the screen (Appears as the same button, though there are two)
const start = document.getElementById("startbtn");  //Start button
const btn = document.getElementById("ctrbtn");  //Incremental button
start.onclick = startSession;
let ctr = 0;  //The counter for how many times the button is pressed
btn.onclick = clickCounter; //When the button is clicked, increment the button

//this is just for testing, it'll be removed later when the program actually stops manually.
const clickThreshold = 100;

console.log(localStorage.clickcount);

if (localStorage.clickcount != 0 || localStorage.clickcount == undefined) {
    btn.style.display = "initial";
    start.style.display = "none";
  } else {
    start.style.display = "initial";
    btn.style.display = "none";
  }

//Hide the start button and show the increment button
function startSession() {
  btn.style.display = "initial";  //Show incremental button
  start.style.display = "none";  //Hide the start button
  console.log("Starting Session Button Clicked");
  localStorage.startTime = Date.now()
  console.log(localStorage.startTime);
}

//This function counts the number of clicks and keeps it stored.
function clickCounter() 
{
  if (typeof(Storage) !== "undefined") 
  {
    if (localStorage.clickcount < clickThreshold) 
    {
      localStorage.clickcount = Number(localStorage.clickcount)+1;
      console.log("You have clicked the button " + localStorage.clickcount + " time(s).");
      if(localStorage.clickcount == clickThreshold)
        {
          //After the experiment ends
          document.getElementById("result-message").textContent="You have now clicked the button " + localStorage.clickcount + " time(s)!";
          let endTime = Date.now();
          console.log(((endTime - localStorage.startTime) / 1000));
          calcResults((endTime - localStorage.startTime) / 1000)
          
          btn.style.display = "none";
          start.style.display = "initial";
        }
    } 
    else 
    {
      localStorage.clickcount = 1;
      console.log("You have clicked the button " + localStorage.clickcount + " time(s).");
    }
  } 
  else 
  {
    console.log("Sorry, your browser does not support web storage...");
  }
}


/////////////////////////
//Reset Functionality
//User will need to hold on to the button for 3 seconds 
//Currently the counter will show in the console.log
//but if we have mroe time would be nice to have it in the website
//Something like of a badge or effect on the button
//I have added a color changing affect
//then the counter will reset 
const resetColor = ['#4ad9e7', '#61ddea', '#77e2ed']
const resetBtn = document.getElementById("ctrbtn");
let modal = document.getElementById("result-modal"); 
let span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
let holdTimer;
if (resetBtn) {
  resetBtn.onmousedown = function() {
    let maxHoldTime = 3;
    holdTimer = setInterval(function(){
      resetBtn.style.background=resetColor[maxHoldTime];
      console.log("maxHoldTime: ", maxHoldTime)
      if(maxHoldTime <= 0){
        modal.style.display = "block";
        resetBtn.style.background='#8ee7f0';
        clearInterval(holdTimer);
        
        //Calculate and end session
        let endTime = Date.now();
        calcResults((endTime - localStorage.startTime) / 1000);
        localStorage.clickcount = 0;
        start.style.display = "initial";
        btn.style.display = "none";
      }
      maxHoldTime -=1;
    }, 1000);
  };
  resetBtn.onmouseup = function() {
    clearInterval(holdTimer);
    resetBtn.style.background='#8ee7f0';
  }
}

//Touch functionality
if (resetBtn) {
  resetBtn.addEventListener("touchstart", function() {
    console.log("reset button down");

    let maxHoldTime = 3;
    holdTimer = setInterval(function(){
      resetBtn.style.background=resetColor[maxHoldTime];
      console.log("maxHoldTime: ", maxHoldTime)
      if(maxHoldTime <= 0){
        modal.style.display = "block";
        resetBtn.style.background='#8ee7f0';
        clearInterval(holdTimer);
        //Calculate and end session
        let endTime = Date.now();
        calcResults((endTime - localStorage.startTime) / 1000);
        localStorage.clickcount = 0;
        start.style.display = "initial";
        btn.style.display = "none";
      }
      maxHoldTime -=1;
    }, 1000);

    var timeleft = 3;
    var downloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(downloadTimer);
        
      }
      timeleft -= 1;
    }, 1000);
  });
  resetBtn.addEventListener("touchend", function() {
    clearInterval(holdTimer);
    resetBtn.style.background='#8ee7f0';
  })
}

///////////////////////////////////
//This function will calculate the results for the user.
//For the sake of testing and the demo, I will make it so that the user should only press the button
//Once every 30 seconds, but must at least press the button every 180 seconds.
//E.g., if their total time is 60 seconds, then if they pressed the button more than 2 times, then they
//Will get the result: "Spoiling too much"
function calcResults(totalTime) {
  console.log("Calculating Results");
  let maxPresses = Math.ceil(totalTime/30); //They must not go over this many presses.
  let minPresses = Math.floor(totalTime/180); //They must click the button at least this many times.
  console.log(localStorage.clickcount);
  console.log("Max Presses:" + maxPresses);
  console.log("Min Presses:" + minPresses);
  //If the maximumpresses is larger, and minpresses is smaller than how much they actually clicked
  if (maxPresses >= localStorage.clickcount && minPresses <= localStorage.clickcount) {
    document.getElementById("result-message").textContent="Result: Doing well";
  } else if (maxPresses < localStorage.clickcount) {
    document.getElementById("result-message").textContent="Result: Caution, give in moderation.";
  } else if (minPresses > localStorage.clickcount) {
    document.getElementById("result-message").textContent="Result: Don't neglect. Give occaisonally";
  } else {
    document.getElementById("result-message").textContent="Error in calculating results.";
  }
}