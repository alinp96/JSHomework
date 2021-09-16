'use strict';


// alergare usoara 260/h
// karate 520/h
// tenis 700
// inot 817
// fotbal 700
// handbal 700
// volei 500

const container = document.querySelector('.container');
const activities = ['Alege activitatea dorita', 'Alergare Usoara', 'Karate', 'Tenis', 
                    'Inot', 'Fotbal', 'Handbal', 'Volei', 'Ridicare greutati'];
const buttons = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Rezumat'];
const kcalTable = [260, 520, 700, 817, 700, 700, 500, 444];
var isFirstTimeUsed = true;
var fieldTime;
var element_totalHours = document.createElement('h2');
var element_totalKcals = document.createElement('h2');
var buttonsField = document.createElement('fieldset');
var legend = document.createElement('legend');

// Function used to render all elements on page
const renderDOM  = function() {
    var button;
    var indexOfButton = 0;
    
    buttonsField.className = 'buttonsField';
    container.appendChild(buttonsField).appendChild(legend);
    
    for(const element of buttons) {
        indexOfButton++;
        button = document.createElement('button');
        button.setAttribute('data-index', indexOfButton);
        button.className = 'legendButtons';
        button.textContent = element;
        legend.appendChild(button);
        
        // Get Dimineata and Seara content
        const displayMorning = displayContentFieldset('Dimineata', element);
        const displayNight = displayContentFieldset('Seara', element);

        // Add all Dimineata and Seara fields to the DOM for each day
        if (element != 'Rezumat') {
            buttonsField.appendChild(displayMorning.fieldSet).appendChild(displayMorning.legend);
            buttonsField.appendChild(displayMorning.fieldSet).appendChild(displayMorning.div);
            buttonsField.appendChild(displayNight.fieldSet).appendChild(displayNight.legend);
            buttonsField.appendChild(displayNight.fieldSet).appendChild(displayNight.div);
        }
        // Add an event to the buttons which will show only relevant data for each day
        button.addEventListener('click', refreshContent, element);
    }
    displayRezumatField();  
    nextAndPrevbtn();
}

// Function that create and manipulate the Next and Previous buttons
const nextAndPrevbtn = function() {
    const currentDisplay = document.getElementById('active_day');
    var currentDayName = currentDisplay.classList[1].replace('contentField', '');
    var currentSelectedButtonIndex = 0;

    // Get the current day name
    for (var index = 0; index < buttons.length; index++) {
        if (buttons[index] == currentDayName) {
            currentSelectedButtonIndex = index;
        }
    }

    // Create next and prev buttons  - only once per webpage instance
    if (isFirstTimeUsed == true) {
        const prevBtn = document.createElement('button');
        const nextBtn = document.createElement('button');
        const buttonsDiv = document.createElement('div')
        const buttonsField = document.querySelector('.buttonsField');

        buttonsDiv.className = 'bottomButtons';
        prevBtn.className = 'bottomButton';
        prevBtn.id = 'prevBtn';
        prevBtn.style.opacity = 0;
        nextBtn.className = 'bottomButton';
        nextBtn.id = 'nextBtn'
        nextBtn.innerHTML = `${buttons[currentSelectedButtonIndex + 1]}`;

        buttonsField.appendChild(buttonsDiv).appendChild(prevBtn);
        buttonsField.appendChild(buttonsDiv).appendChild(nextBtn);

        prevBtn.addEventListener('click', refreshContent, buttons[currentSelectedButtonIndex]);
        nextBtn.addEventListener('click', refreshContent, buttons[currentSelectedButtonIndex]);
        isFirstTimeUsed = false;
    }
    // Get next and prev buttons elements and manipulate them
    else {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // If the current selected day is Luni, show only the next button (with the next day name)
        if (currentSelectedButtonIndex == 0){
            prevBtn.style.opacity = 0;
            nextBtn.innerHTML = `${buttons[currentSelectedButtonIndex + 1]}`;
            nextBtn.style.opacity = 1;
        }
        // If the current selected day is less than Vineri, show both next and button (with aferent name)
        else if (currentSelectedButtonIndex < 4){
            prevBtn.innerHTML = `${buttons[currentSelectedButtonIndex - 1]}`;
            prevBtn.style.opacity = 1;
            nextBtn.innerHTML = `${buttons[currentSelectedButtonIndex + 1]}`;
            nextBtn.style.opacity = 1;
        }
        // If the current selected day is Vienri, show only the prev button (with the prev day name)
        else if (currentSelectedButtonIndex == 4){
            prevBtn.innerHTML = `${buttons[currentSelectedButtonIndex - 1]}`;
            prevBtn.style.opacity = 1;
            nextBtn.style.opacity = 0;
        }
        // If the current selected button is Rezumat, hide both buttons
        else {
            prevBtn.style.opacity = 0;
            nextBtn.style.opacity = 0;
        }
    }
}


const refreshContent = function(element) {
    const allCF = document.querySelectorAll('.contentField');

    allCF.forEach(contentField => {
        if (contentField.classList[1] == `contentField${element.target.innerHTML}`) {
            contentField.id = 'active_day';
            if (contentField.classList[1] == 'contentFieldRezumat') {
                rezumatInitialData();
            }
        }
        else{
            contentField.id = '';
        }
    });

    if(isFirstTimeUsed == false) {
        nextAndPrevbtn();
        displayRezumatField();
    }
}

// Create, display and store fields from Dimineata and Seara fieldsets
const displayContentFieldset =  function(labelValue, day) {
    var div = document.createElement('div');
    var fieldSet = document.createElement('fieldset');
    var legend = document.createElement('legend');
    var displayActivityResults = createAndDisplayActivityField('Activitate', activities, day, labelValue);
    var displayFirstTimefield = displayTimeField('De la', '07:00', '12:00', day, labelValue);
    var displaySecondTimefield = displayTimeField('Pana la', '17:00', '23:00', day, labelValue);

    fieldSet.classList = `contentField contentField${day} `;
    if (day == 'Luni') {
        fieldSet.id = 'active_day';
    }
    legend.textContent = labelValue;
    div.className = 'content';
    div.appendChild(displayActivityResults.label);
    div.appendChild(displayActivityResults.select)
    div.appendChild(displayFirstTimefield.label);
    div.appendChild(displayFirstTimefield.input);
    div.appendChild(displaySecondTimefield.label);
    div.appendChild(displaySecondTimefield.input);
    return{
        fieldSet,
        legend,
        div
    };
}

// Create and store time fields
const displayTimeField = function(labelValue, min_hour, max_hour, day, partOfDay) {
    var label = document.createElement('label');
    var input = document.createElement('input');
    label.textContent = labelValue;
    input.setAttribute('type', 'time');
    input.setAttribute('min', min_hour);
    input.setAttribute('max', max_hour);
    input.id = `${labelValue == 'De la' ? 'from' : 'to'}_timebox_${day.toLowerCase()}_${partOfDay.toLowerCase()}`;
    input.required;
    return {
        label,
        input
    };
}

// Store and display a resume of data selected from all days
const displayRezumatField = function() {
    var day = []; 
    var morningActivity = [];
    var nightActivity = [];
    var bt_field = document.querySelector('.buttonsField');
    var rezumatDiv = document.createElement('div');
    var rawTotalHours = 0;
    var rawTotalMinutes = 0;
    var rawTotalKcalsBured = 0;

    rezumatDiv.className = 'contentField contentFieldRezumat';

    // Loop trough all days
    buttons.forEach(element => {
        // Get all the data from current day
        const morningFrom = document.getElementById(`from_timebox_${element.toLowerCase()}_dimineata`);
        const morningTo = document.getElementById(`to_timebox_${element.toLowerCase()}_dimineata`);
        const nightFrom = document.getElementById(`from_timebox_${element.toLowerCase()}_seara`);
        const nightTo = document.getElementById(`to_timebox_${element.toLowerCase()}_seara`);
        const selectedActivityMorning = document.getElementById(`select_activity_${element.toLowerCase()}_dimineata`);
        const selectedActivityNight = document.getElementById(`select_activity_${element.toLowerCase()}_seara`);

        // First time when it gets here create paragraphs for each day to have where to show data
        if (isFirstTimeUsed == true) {
            var element_day = document.createElement('p');
            var element_morningActivity = document.createElement('p');
            var element_nightActivity = document.createElement('p');
            element_day.innerHTML = element;
            element_day.className = `rezumatParagraph ${element.toLocaleLowerCase()}_day`;
            element_morningActivity.innerHTML = `${morningFrom == null ? 'notSet' : morningFrom.value}-${morningTo == null ? 'notSet' : morningTo.value} ${selectedActivityMorning == null ? 'notSet' : selectedActivityMorning[selectedActivityMorning.selectedIndex].text}`;
            element_morningActivity.className = `rezumatParagraph ${element.toLocaleLowerCase()}_dimineata`;
            element_nightActivity.innerHTML = `${nightFrom  == null ? 'notSet' : nightFrom.value}-${nightTo  == null ? 'notSet' : nightTo.value} ${selectedActivityNight == null ? 'notSet' : selectedActivityNight[selectedActivityNight.selectedIndex].text}`;
            element_nightActivity.className = `rezumatParagraph ${element.toLocaleLowerCase()}_seara`;
            element_totalHours.innerHTML = '';
            element_totalHours.className = 'rezumatTxt';
            element_totalHours.id = 'totalHoursTxt';
            element_totalKcals.innerHTML = '';
            element_totalKcals.className = 'rezumatTxt';
            element_totalKcals.id = 'totalKcalsTxt';

            day.push(element_day);
            morningActivity.push(element_morningActivity);
            nightActivity.push(element_nightActivity);
        } else {
            // Get current day paragraphs that need to be edited
            var element_morningActivity = document.querySelector(`.${element.toLocaleLowerCase()}_dimineata`);
            var element_nightActivity = document.querySelector(`.${element.toLocaleLowerCase()}_seara`);
            
            // If the current tab is a day, continue
            if (element != 'Rezumat'){
                // If something is not completed (activity not selected or hour interval) don't show anything about that day
                if ((selectedActivityMorning[selectedActivityMorning.selectedIndex].text == 'Alege activitatea dorita') || (morningFrom.value == '') || (morningTo.value) == '') {
                    element_morningActivity.innerHTML = '' ;
                }
                else {
                    // Get the total time and total kcals burned from current day and add it to the grand total
                    fieldTime = totalTime(morningFrom.value, morningTo.value).split(':');
                    rawTotalHours += parseInt(fieldTime[0]);
                    rawTotalMinutes += parseInt(fieldTime[1]);
                    rawTotalKcalsBured += (kcalTable[selectedActivityMorning.selectedIndex - 1] / 60) * ((parseInt(fieldTime[0]) * 60) + parseInt(fieldTime[1]));
                }
                if ((selectedActivityNight[selectedActivityNight.selectedIndex].text == 'Alege activitatea dorita') || (nightFrom.value == '') || (nightTo.value) == '') {
                    element_nightActivity.innerHTML = '' ;
                }
                else {
                    fieldTime = totalTime(nightFrom.value, nightTo.value).split(':');
                    rawTotalHours += parseInt(fieldTime[0]);
                    rawTotalMinutes += parseInt(fieldTime[1]);
                    rawTotalKcalsBured += (kcalTable[selectedActivityNight.selectedIndex - 1] / 60) * ((parseInt(fieldTime[0]) * 60) + parseInt(fieldTime[1]));
                }
            }
        }      
    });
    // If it is the first time that it gets here, append elements to the DOM
    if (isFirstTimeUsed == true) {
        for (var index = 0; index < buttons.length - 1; index++) {
            bt_field.appendChild(rezumatDiv).appendChild(day[index]);
            bt_field.appendChild(rezumatDiv).appendChild(morningActivity[index]);
            bt_field.appendChild(rezumatDiv).appendChild(nightActivity[index]);
        }
        bt_field.appendChild(rezumatDiv).appendChild(element_totalHours);
        bt_field.appendChild(rezumatDiv).appendChild(element_totalKcals);
    }
    else {
        // Calculate and display the total hours and total kcals bured of whole week
        var totalHours = Math.floor((rawTotalMinutes / 60 + rawTotalHours).toFixed(2));
        var totalMinutes = rawTotalMinutes % 60;
        var displayTotal = document.getElementById('totalHoursTxt');
        var displayKcals = document.getElementById('totalKcalsTxt');
        displayTotal.innerHTML = `Total: ${totalHours} ${totalHours == 1 ? 'ora' : 'ore'} si ${totalMinutes} ${totalMinutes == 1 ? 'minut' : 'minute'}`;
        displayKcals.innerHTML = `Kcalorii consumate: ${rawTotalKcalsBured.toFixed(0)}`;
    }
}

// Formula that returns total hours and minutes of an interval (copyright StackOverflow)
const totalTime = function(start, end) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    
    return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
}

const rezumatInitialData = function (){

    buttons.forEach(element => {
        if(element.toLowerCase() != 'rezumat'){
            // var day = document.querySelector(`.${element.toLowerCase()}_day`);
            var morning = document.querySelector(`.${element.toLowerCase()}_dimineata`);
            var night = document.querySelector(`.${element.toLowerCase()}_seara`);
            const morningFrom = document.getElementById(`from_timebox_${element.toLowerCase()}_dimineata`);
            const morningTo = document.getElementById(`to_timebox_${element.toLowerCase()}_dimineata`);
            const nightFrom = document.getElementById(`from_timebox_${element.toLowerCase()}_seara`);
            const nightTo = document.getElementById(`to_timebox_${element.toLowerCase()}_seara`);
            const selectedActivityMorning = document.getElementById(`select_activity_${element.toLowerCase()}_dimineata`);
            const selectedActivityNight = document.getElementById(`select_activity_${element.toLowerCase()}_seara`);

            morning.innerHTML = `${morningFrom == null ? 'notSet' : morningFrom.value}-${morningTo == null ? 'notSet' : morningTo.value} ${selectedActivityMorning == null ? 'notSet' : selectedActivityMorning[selectedActivityMorning.selectedIndex].text}`;
            night.innerHTML = `${nightFrom == null ? 'notSet' : nightFrom.value}-${nightTo == null ? 'notSet' : nightTo.value} ${selectedActivityNight == null ? 'notSet' : selectedActivityNight[selectedActivityNight.selectedIndex].text}`
        }
        
    });
}

// Create the Activity select and add all options from an array
const createAndDisplayActivityField = function(labelValue, activities, day, partOfDay)
{
    var label = document.createElement('label');
    var select = document.createElement('select');
    var option;
    label.textContent = labelValue;
    select.name = 'select_activity';
    select.id = `select_activity_${day.toLowerCase()}_${partOfDay.toLowerCase()}`;

    for(const activity of activities) {
        option = document.createElement('option');
        option.value = activity.toLowerCase().replaceAll(' ', '');
        option.text = activity;
        select.appendChild(option);
    }
    return {
        label,
        select
    };
}


renderDOM();