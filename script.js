let agents = [
    { name: 'Judiemae', days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], startHour: 21, endHour: 5, color: '#ffcccb'},
    { name: 'Thelma', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], startHour: 5, endHour: 13, color: '#add8e6'},
    { name: 'New Agent', days: ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'], startHour: 13, endHour: 21, color: '#90ee90'}
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function updateTable() {
    const tbody = document.querySelector('#scheduleTable tbody');
    tbody.innerHTML = '';
    for (let hour = 0; hour < 24; hour++) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = hour < 10 ? `0${hour}:00` : `${hour}:00`;
        row.appendChild(timeCell);
        for (let day = 0; day < daysOfWeek.length; day++) {
            const cell = document.createElement('td');
            const dayOfTheWeek = daysOfWeek[day];
            const agentsWorkingThisHour = agents.filter(agent =>
                isWorking(agent, dayOfTheWeek, hour)
            );
            agentsWorkingThisHour.forEach(agent => {
                const span = document.createElement('span');
                span.style.backgroundColor = agent.color;
                span.className = 'agent-cell';
                span.textContent = agent.name;
                cell.appendChild(span);
            });
            if (agentsWorkingThisHour.length === 1) {
                cell.style.backgroundColor = agentsWorkingThisHour[0].color;
            }
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}

function isWorking(agent, dayOfTheWeek, hour) {
    const index = daysOfWeek.indexOf(dayOfTheWeek);
    let startHour = agent.startHour;
    let endHour = agent.endHour;
    
    if (startHour > endHour) { // handle overnight shifts
        if (agent.days.includes(dayOfTheWeek)) {
            if (hour >= startHour && hour <= 23) {
                return true;
            }
        }
        const previousDayIndex = (index === 0) ? 6 : index - 1;
        const previousDay = daysOfWeek[previousDayIndex];
        if (agent.days.includes(previousDay)) {
            if (hour >= 0 && hour < endHour) {
                return true;
            }
        }
    } else { // regular shift within the same day
        if (agent.days.includes(dayOfTheWeek) && hour >= startHour && hour < endHour) {
            return true;
        }
    }
    return false;
}

function buildAgentControls() {
    const controls = document.getElementById('agentControls');
    controls.innerHTML = '';
    agents.forEach((agent, index) => {
        const div = document.createElement('div');
        div.className = 'agent-control';
        let controlsHTML = `<div><input type="text" value="${agent.name}" onblur="updateAgentName(${index}, this.value)">
            <button onclick="removeAgent(${index})">-</button></div>
            <div>Start: <input type="number" value="${agent.startHour}" onchange="updateAgent(${index}, 'startHour', parseInt(this.value))"></div>
            <div>End: <input type="number" value="${agent.endHour}" onchange="updateAgent(${index}, 'endHour', parseInt(this.value))"></div>
            <div>Days: ${daysOfWeek.map(day => `<label><input type="checkbox" ${agent.days.includes(day) ? 'checked' : ''} onchange="toggleDay('${agent.name}', '${day}')">${day}</label>`).join(' ')}</div>`;
        div.innerHTML = controlsHTML;
        controls.appendChild(div);
    });
}

function addAgent() {
    const newName = prompt("Enter new agent's name:");
    const newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    if (newName) {
        agents.push({ name: newName, days: ['Monday'], startHour: 9, endHour: 17, color: newColor });
        buildAgentControls();
        updateTable();
    }
}

function removeAgent(index) {
    agents.splice(index, 1);
    buildAgentControls();
    updateTable();
}

function updateAgent(index, field, value) {
    agents[index][field] = value;
    updateTable();
}

function updateAgentName(index, newName) {
    agents[index].name = newName;
    updateTable();
}

function toggleDay(agentName, day) {
    const agent = agents.find(a => a.name === agentName);
    const dayIndex = agent.days.indexOf(day);
    if (dayIndex > -1) {
        agent.days.splice(dayIndex, 1);
    } else {
        agent.days.push(day);
    }
    updateTable();
}

buildAgentControls();
updateTable();
