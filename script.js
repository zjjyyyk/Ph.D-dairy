async function fetchEvents(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    // 文件夹须命名为yyyy.mm.dd-yyyy.mm.dd
    const folderName = `${startDate.getFullYear()}.${(startDate.getMonth() + 1).toString().padStart(2, '0')}.${startDate.getDate().toString().padStart(2, '0')}-${endDate.getFullYear()}.${(endDate.getMonth() + 1).toString().padStart(2, '0')}.${endDate.getDate().toString().padStart(2, '0')}`;
    const response = await fetch(`http://localhost:8000/${folderName}/events.json`);
    if (response.ok) {
        let eventsText = await response.text();
        eventsText = eventsText.replace(/{{foldername}}/g, `http://localhost:8000/${folderName}`);
        const events = JSON.parse(eventsText);
        return events;
    } else {
        console.error("Failed to load events.json");
        return {};
    }
}

function highlightToday() {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const days = document.querySelectorAll('.calendar-body .day');
    days.forEach(day => {
        const dayDate = new Date(`${today.getFullYear()}-${day.getAttribute('data-month')}-${day.getAttribute('data-date')}`);
        const dayString = `${dayDate.getFullYear()}-${dayDate.getMonth() + 1}-${dayDate.getDate()}`;
        if (dayString === todayString) {
            day.classList.add('highlight');
        } else {
            day.classList.remove('highlight');
        }
    });
}

function highlightSelected(date) {
    const days = document.querySelectorAll('.calendar-body .day');
    days.forEach(day => {
        if (parseInt(day.getAttribute('data-date')) === date.getDate() &&
            parseInt(day.getAttribute('data-month')) === (date.getMonth() + 1) &&
            parseInt(day.getAttribute('data-year')) === date.getFullYear()) {
            day.classList.add('selected');
        } else {
            day.classList.remove('selected');
        }
    });
}

async function displayCalendar(firstDayOfWeek) {
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = ''; // 清空上一次生成的日历

    const events = await fetchEvents(firstDayOfWeek);
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(firstDayOfWeek);
        currentDay.setDate(firstDayOfWeek.getDate() + i);
        const dateKey = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;
        dates.push({
            day: currentDay.getDay(),
            date: currentDay.getDate(),
            month: currentDay.getMonth() + 1,
            year: currentDay.getFullYear(),
            events: events[dateKey] || []
        });
    }
    const currentMonth = document.getElementById('current-month').querySelector('span');
    currentMonth.innerText = `${dates[0].year}年${dates[0].month}月`;

    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    dates.forEach(date => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.setAttribute('data-date', date.date);
        dayDiv.setAttribute('data-month', date.month);
        dayDiv.setAttribute('data-year', date.year);
        dayDiv.innerHTML = `<div class="data-title">${dayNames[date.day]}<br>${date.date}</div>`;

        const eventsDiv = document.createElement('div');
        eventsDiv.classList.add('events');
        date.events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = event.title;
            eventDiv.title = event.description; // 添加悬停内容
            if (event.attach) {
                eventDiv.addEventListener('click', () => {
                    window.open(event.attach, '_blank');
                });
                eventDiv.style.cursor = 'pointer';
            }
            if (event.color) {
                eventDiv.style.backgroundColor = event.color;
            }
            eventsDiv.appendChild(eventDiv);
        });
        dayDiv.appendChild(eventsDiv);
        calendarBody.appendChild(dayDiv);
    });

}


async function generateCalendar(weekOffset = 0) {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1); // 设置为本周的周一

    await displayCalendar(firstDayOfWeek);
    highlightToday();
}

async function generateCalendarForDate(date) {
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = ''; // 清空上一次生成的日历
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - date.getDay() + 1); // 设置为本周的周一

    
    await displayCalendar(firstDayOfWeek);
    highlightToday();
    highlightSelected(date);
}

let weekOffset = 0;

document.getElementById('today-button').addEventListener('click', () => {
    weekOffset = 0;
    generateCalendar(weekOffset);
    highlightSelected(new Date());
});

document.getElementById('prev-week').addEventListener('click', () => {
    weekOffset--;
    generateCalendar(weekOffset);
});

document.getElementById('next-week').addEventListener('click', () => {
    weekOffset++;
    generateCalendar(weekOffset);
});

document.getElementById('dropdown-toggle').addEventListener('click', () => {
    const datePicker = document.getElementById('date-picker');
    datePicker.style.display = 'inline';
    datePicker.focus();
});

document.getElementById('date-picker').value = new Date().toISOString().split('T')[0];

document.getElementById('date-picker').addEventListener('change', (event) => {
    const selectedDate = new Date(event.target.value);
    generateCalendarForDate(selectedDate);
    document.getElementById('date-picker').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const datePicker = document.getElementById('date-picker');
    if (!document.getElementById('dropdown-toggle').contains(e.target) && !datePicker.contains(e.target)) {
        datePicker.style.display = 'none';
    }
});

generateCalendar();
