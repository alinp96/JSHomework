'use strict';



// init function
const init = function(props) {
	const BUTTON_TYPE_DAY = 'day';
  const BUTTON_TYPE_SUMMARY = 'summary';
  
  const buttonsTabs = [{
      name: 'Luni',
      type: BUTTON_TYPE_DAY
    },
    {
      name: 'Marti',
      type: BUTTON_TYPE_DAY
    },
    {
      name: 'Miercuri',
      type: BUTTON_TYPE_DAY
    },
    {
      name: 'Joi',
      type: BUTTON_TYPE_DAY
    },
    {
      name: 'Vineri',
      type: BUTTON_TYPE_DAY
    },
    {
      name: 'Rezumat',
      type: BUTTON_TYPE_SUMMARY
    }
  ];

  const activities = [{
      index: 0,
      name: 'Alege activitatea dorita',
      energy: 0
    },
    {
      index: 1,
      name: 'Alergare Usoara',
      energy: 260
    },
    {
      index: 2,
      name: 'Karate',
      energy: 520
    },
    {
      index: 3,
      name: 'Tenis',
      energy: 700
    },
    {
      index: 4,
      name: 'Inot',
      energy: 817
    },
    {
      index: 5,
      name: 'Fotbal',
      energy: 700
    },
    {
      index: 6,
      name: 'Handbal',
      energy: 500
    },
    {
      index: 7,
      name: 'Volei',
      energy: 444
    }
  ];

  let currentTab = 0;

  const switchBottomButtonsName = () => {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Find first day
    const firstDay = buttonsTabs.find(({
      type
    }) => type === BUTTON_TYPE_DAY);
    // Find last day
    const lastDay = buttonsTabs.reverse().find(({
      type
    }) => type === BUTTON_TYPE_DAY);
    buttonsTabs.reverse();

    if (buttonsTabs[currentTab].name === firstDay.name) {
      prevBtn.style.opacity = 0;
      nextBtn.innerHTML = buttonsTabs[currentTab + 1].name;
      nextBtn.style.opacity = 1;
    } else if (buttonsTabs[currentTab].name === lastDay.name) {
      prevBtn.innerHTML = buttonsTabs[currentTab - 1].name;
      prevBtn.style.opacity = 1;
      nextBtn.style.opacity = 0;
    } else if (buttonsTabs[currentTab].type === 'summary') {
      prevBtn.style.opacity = 0;
      nextBtn.style.opacity = 0;
    } else {
      prevBtn.innerHTML = buttonsTabs[currentTab - 1].name;
      prevBtn.style.opacity = 1;
      nextBtn.innerHTML = buttonsTabs[currentTab + 1].name;
      nextBtn.style.opacity = 1;
    }
    // nextBtn.setAttribute('data-target', currentTab + 1);
    // pentru a actualiza current tab
    prevBtn.addEventListener('click', selectTab.bind(this, currentTab - 1));
    nextBtn.addEventListener('click', selectTab.bind(this, currentTab + 1));
  }

  // Function that can show only the current day fields trough an index parameter
  const selectTab = (index) => {
    const tabList = props.tabs.getElementsByClassName('tab-inner');
    const summary_txt = document.getElementsByClassName('summary-hour-txt')[0];
    const summary_kcal = document.getElementsByClassName('summary-kcal-txt')[0];
    let total_hours = 0;
    let total_minutes = 0;
    let total_kcalories = 0;
    let results;

    for (const tab of tabList) {
      if (tab.getAttribute('data-tab-index') === index.toString()) {
        tab.style = 'display: block';
        currentTab = index;
      } else {
        tab.style = 'display: none';
      }
    }
    switchBottomButtonsName();

    for (const element of buttonsTabs){
      results = updateSummary(element);
      total_hours += results.current_day_total_hours;
      total_minutes += results.current_day_total_minutes;
      total_kcalories += results.total_kcals;
    }
    // console.log(total_hours);
    // console.log(total_minutes);
    summary_txt.innerHTML = `Total: ${total_hours} ${total_hours !== 1 ? 'ore' : 'ora'} si ${total_minutes} ${total_minutes !== 1 ? 'minute' : 'minut'}`;
    summary_kcal.innerHTML = `KCalorii consumate: ${total_kcalories.toFixed(0)}`;
  }

  

  const updateSummary = (element) =>{
    let summary_button = document.querySelectorAll('button')[5];
    const morningFrom = getTimeFieldId('from', element, 'Dimineata');
    const morningTo = getTimeFieldId('to', element, 'Dimineata');
    const nightFrom = getTimeFieldId('from', element, 'Seara');
    const nightTo = getTimeFieldId('to', element, 'Seara');
    const selectedActivityMorning = document.getElementById(`select-activity-${element.name.toLowerCase()}-dimineata`);
    const selectedActivityNight = document.getElementById(`select-activity-${element.name.toLowerCase()}-seara`);
    const currentDayDiv = document.getElementsByClassName(`container-${element.name.toLowerCase()}-div`)
    let morningCheck = false;
    let eveningCheck = false;
    let summary_day_p = document.getElementsByClassName(`summary-p-${element.name.toLowerCase()}`)[0];
    let summary_morning_p = document.getElementsByClassName(`summary-p-${element.name.toLowerCase()}-morning`)[0];
    let summary_evening_p = document.getElementsByClassName(`summary-p-${element.name.toLowerCase()}-evening`)[0];
    let results;
    let current_day_total_hours = 0;
    let current_day_total_minutes = 0;
    let current_day_morning_activity = 0;
    let current_day_evening_activity = 0;
    let total_kcals = 0;

    if(element.type === BUTTON_TYPE_DAY){
      morningCheck = partOfDayCompletedCorrectly(morningFrom, morningTo, selectedActivityMorning);
      eveningCheck = partOfDayCompletedCorrectly(nightFrom, nightTo, selectedActivityNight);
      
      if (morningCheck === false && eveningCheck === false){
        currentDayDiv.style = 'display: none;';
        summary_day_p.style = 'display: none;';
        summary_morning_p.style = 'display: none;'
        summary_evening_p.style = 'display: none;'
      }

      if (morningCheck === true){
        summary_day_p.style = 'display: block;';
        summary_morning_p.innerHTML = `Dimineata: ${morningFrom.value}-${morningTo.value} -> ${selectedActivityMorning[selectedActivityMorning.selectedIndex].text}`;
        summary_morning_p.style = 'display: block;'
        summary_button.disabled = 0;
        results = calculateResults(morningFrom.value, morningTo.value);
        current_day_total_hours += results.total_hours;
        current_day_total_minutes += results.total_minutes;
        current_day_morning_activity = selectedActivityMorning.selectedIndex;
        total_kcals += totalKcals(activities[current_day_morning_activity].energy, results.total_hours, results.total_minutes)
      }

      if (eveningCheck === true){
        summary_day_p.style = 'display: block;';
        summary_evening_p.innerHTML = `Seara: ${nightFrom.value}-${nightTo.value} -> ${selectedActivityNight[selectedActivityNight.selectedIndex].text}`;
        summary_evening_p.style = 'display: block;'
        summary_button.disabled = 0;
        results = calculateResults(nightFrom.value, nightTo.value);
        current_day_total_hours += results.total_hours;
        current_day_total_minutes += results.total_minutes;
        current_day_evening_activity = selectedActivityNight.selectedIndex;
        total_kcals += totalKcals(activities[current_day_evening_activity].energy, results.total_hours, results.total_minutes)
      }
    }
    return {
      current_day_total_hours,
      current_day_total_minutes,
      current_day_morning_activity,
      current_day_evening_activity,
      total_kcals
    };
  }

  const totalKcals = (kcal, hours, minutes) => {
    return (kcal / 60) * (hours * 60 + minutes);
  }

  const calculateResults = (start, end) => {
    let raw_time = totalTime(start, end).split(':');
    let total_hours = parseInt(raw_time[0]);
    let total_minutes = parseInt(raw_time[1]);  
    return {
      total_hours, 
      total_minutes
    };  
  }

  const totalTime = function(start, end) {
    start = start.split(":");
    end = end.split(":");
    let startDate = new Date(0, 0, 0, start[0], start[1], 0);
    let endDate = new Date(0, 0, 0, end[0], end[1], 0);
    let diff = endDate.getTime() - startDate.getTime();
    let hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    let minutes = Math.floor(diff / 1000 / 60);
    
    return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
}

  const partOfDayCompletedCorrectly = (from, to, activity) =>{
    let returnValue = true;
    if((activity.selectedIndex === 0) || (from.value === '') || (to.value === '')){
      returnValue = false;
    }
    return returnValue;
  }

  // Function that create and render all the tabs
  const renderTabs = () => {
    let indexOfButton = 0;
    const legend = document.createElement('legend');
    legend.classList.add('tabs-legend');
    props.tabs.appendChild(legend);

    for (const element of buttonsTabs) {
      const button = document.createElement('button');
      button.setAttribute('data-index', indexOfButton);
      button.textContent = element.name;
      button.addEventListener('click', selectTab.bind(this, indexOfButton));
      legend.appendChild(button);
      indexOfButton += 1;
    }
  };
  // Function that create and render content of each tab
  const renderContent = () => {
    let indexOfTab = 0;
    for (const element of buttonsTabs) {

      const tabContainer = document.createElement('div');
      tabContainer.setAttribute('data-tab-index', indexOfTab);
      // tabContainer.textContent = element.name;
      tabContainer.classList.add('tab-inner');
      tabContainer.style = 'display: block';
      props.content.appendChild(tabContainer);
      if(element.type === BUTTON_TYPE_DAY) {
        renderPartOfDay(indexOfTab, 'Dimineata');
        renderPartOfDay(indexOfTab, 'Seara');
      }
      if(element.type === BUTTON_TYPE_SUMMARY) {
        tabContainer.classList.add('summary-inner');
        renderSummaryContent(element, tabContainer);
      }
      indexOfTab += 1;
    }
  }

  const renderPartOfDay = (indexOfTab, partOfDay) => {
    let tabContainer = '';
    const partOfDayFieldset = document.createElement('fieldset');
    const partOfDayLegend = document.createElement('legend');
    let currentTabName = '';
    tabContainer = document.getElementsByClassName('tab-inner')[indexOfTab];
    partOfDayLegend.textContent = partOfDay;
    currentTabName = buttonsTabs[tabContainer.getAttribute('data-tab-index')].name;
    partOfDayFieldset.classList.add(`fieldset-${currentTabName}-${partOfDay}`)
    tabContainer.appendChild(partOfDayFieldset).appendChild(partOfDayLegend);
    renderPartOfDayFields(currentTabName, tabContainer.appendChild(partOfDayFieldset), partOfDay);
  }

  const renderPartOfDayFields = (currentDayName, tabFieldsetContainer, partOfDay) => {
    renderActivityField('Activity', currentDayName, tabFieldsetContainer, partOfDay);
    renderTimeField('De la', '07:00', '12:00', currentDayName, tabFieldsetContainer, partOfDay);
    renderTimeField('Pana la', '16:00', '23:59', currentDayName, tabFieldsetContainer, partOfDay);
  }

  const renderSummaryContent = (element, tabContainer) => {
    
    let summary_button = document.querySelectorAll('button')[5];
    let results_div = document.createElement('div');
    let total_h = document.createElement('h1');
    let total_kcal = document.createElement('h1');

    for (const button of buttonsTabs){
      if(button.type === BUTTON_TYPE_DAY) {
        let day_div = document.createElement('div');
        let button_day = document.createElement('p');
        let button_morning = document.createElement('p');
        let button_evening = document.createElement('p');
        
        
        day_div.classList.add(`container-${button.name.toLocaleLowerCase()}-div`);
        button_day.innerHTML = button.name;
        button_day.classList.add('summary-day');
        button_day.classList.add(`summary-p-${button.name.toLowerCase()}`);
        button_morning.innerHTML = '';
        button_morning.classList.add('summary-info');
        button_morning.classList.add(`summary-p-${button.name.toLowerCase()}-morning`);
        button_evening.innerHTML = ''
        button_evening.classList.add('summary-info');
        button_evening.classList.add(`summary-p-${button.name.toLowerCase()}-evening`);
        results_div.classList.add('results-div');
        total_h.classList.add('summary-txt');
        total_h.classList.add('summary-hour-txt');
        total_h.innerHTML = '';
        total_kcal.classList.add('summary-txt');
        total_kcal.classList.add('summary-kcal-txt');
        total_kcal.innerHTML = ''

        tabContainer.appendChild(day_div).appendChild(button_day);
        tabContainer.appendChild(day_div).appendChild(button_morning);
        tabContainer.appendChild(day_div).appendChild(button_evening);
      }
    }
    tabContainer.appendChild(results_div).appendChild(total_h);
    tabContainer.appendChild(results_div).appendChild(total_kcal);
    summary_button.disabled = 1;
  }

  const getTimeFieldId = (time, element, partOfDay) => {
      return document.getElementById(`${time}-timebox-${element.name.toLowerCase()}-${partOfDay.toLowerCase()}`); 
  }
  const renderActivityField = (labelName, currentDayName, tabFieldsetContainer, partOfDay) => {
    let label = document.createElement('label');
    let select = document.createElement('select');
    let option;

    label.textContent = labelName;
    select.name = 'select-activity';
    select.id = `select-activity-${currentDayName.toLowerCase()}-${partOfDay.toLowerCase()}`;

    for(const activity of activities) {
        option = document.createElement('option');
        option.value = activity.index;
        option.text = activity.name;
        select.appendChild(option);
    }

    tabFieldsetContainer.appendChild(label);
    tabFieldsetContainer.appendChild(select);
  }

  const renderTimeField = (labelValue, min_h, max_h, currentDayName, tabFieldsetContainer, partOfDay) => {
    var label = document.createElement('label');
    var input = document.createElement('input');
    label.textContent = labelValue;
    input.setAttribute('type', 'time');
    input.setAttribute('min', min_h);
    input.setAttribute('max', max_h);
    input.id = `${labelValue === 'De la' ? 'from' : 'to'}-timebox-${currentDayName.toLowerCase()}-${partOfDay.toLowerCase()}`;
    
    tabFieldsetContainer.appendChild(label);
    tabFieldsetContainer.appendChild(input);
}

  const renderNextAndPrevBtns = () => {
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');
    const nextPrevContainer = document.createElement('div');
    const tabsField = document.getElementsByClassName('tabs')[0];

    nextPrevContainer.classList.add('bottomButtons');
    prevBtn.classList.add('bottomButton');
    prevBtn.id = 'prevBtn';
    prevBtn.style.opacity = 0;
    nextBtn.className = 'bottomButton';
    nextBtn.id = 'nextBtn';
    nextBtn.innerHTML = buttonsTabs[currentTab + 1].name;

    prevBtn.addEventListener('click', selectTab.bind(this, currentTab - 1));
    nextBtn.addEventListener('click', selectTab.bind(this, currentTab + 1));

    tabsField.appendChild(nextPrevContainer).appendChild(prevBtn);
    tabsField.appendChild(nextPrevContainer).appendChild(nextBtn);
  }


  renderTabs();
  renderContent();
  renderNextAndPrevBtns();
  selectTab(0);
}

const application = init({
  tabs: document.getElementsByClassName('tabs')[0],
  content: document.getElementsByClassName('tabs-content')[0]
});
// switchBottomButtonsName(4);
