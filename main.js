let db = JSON.parse(localStorage.getItem('rentDb')) || { properties: {} };

function saveDb() { localStorage.setItem('rentDb', JSON.stringify(db)); }

function selectRole(r) {
    document.getElementById('roleSelection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

function handleLogin() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('managementSection').style.display = 'block';
    showAdminProperties();
}

function addProperty() {
    const name = document.getElementById('newPropName').value;
    if(name) { db.properties[name] = { units: {}, tenants: [] }; saveDb(); showAdminProperties(); }
}

function showAdminProperties() {
    document.getElementById('adminPropertySelect').style.display = 'block';
    const list = document.getElementById('propertyList');
    list.innerHTML = ""; // Clear current list

    Object.keys(db.properties).forEach(p => {
        list.innerHTML += `
            <div style="margin-bottom: 10px;">
                <button onclick="enterProperty('${p}')">${p}</button>
                <button onclick="deleteProperty('${p}')" style="background-color: red; color: white;">Delete</button>
            </div>
        `;
    });
}

function deleteProperty(name) {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        // 1. Remove from the object
        delete db.properties[name];
        
        // 2. Save the updated database
        saveDb();
        
        // 3. Refresh the list UI
        showAdminProperties();
    }
}

function enterProperty(name) {
    localStorage.setItem('activeProp', name);
    document.getElementById('adminPropertySelect').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    document.getElementById('propTitle').innerText = name;
}

function saveInventory() {
    const prop = localStorage.getItem('activeProp');
    db.properties[prop].units = { 
        single: {p: document.getElementById('p_single').value, c: document.getElementById('c_single').value},
        one: {p: document.getElementById('p_one').value, c: document.getElementById('c_one').value},
        two: {p: document.getElementById('p_two').value, c: document.getElementById('c_two').value}
    };
    saveDb(); alert("Inventory Saved!");
}

function addTenant() {
    const prop = localStorage.getItem('activeProp');
    db.properties[prop].tenants.push({
        name: document.getElementById('tName').value,
        room: document.getElementById('tRoom').value,
        phone: document.getElementById('tPhone').value,
        type: document.getElementById('tType').value,
        balance: 0
    });
    saveDb(); alert("Tenant Added!");
}

function goToManagement() {
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('managementPortal').style.display = 'block';
    const body = document.getElementById('tenantTableBody');
    body.innerHTML = "";
    db.properties[localStorage.getItem('activeProp')].tenants.forEach((t, i) => {
        body.innerHTML += `<tr>
    <td>${t.name}</td>
    <td>${t.room}</td>
    <td>${t.phone}</td>
    <td>$${t.balance}</td>
    <td><button class="delete-btn" onclick="deleteTenant(${i})">Delete</button></td>
</tr>`;
;
    });
}

function deleteTenant(i) {
    const prop = localStorage.getItem('activeProp');
    db.properties[prop].tenants.splice(i, 1); saveDb(); goToManagement();
}

function backToDashboard() {
    document.getElementById('managementPortal').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}