console.log("=== DEBUG VERSION ===");

// Elements
const btnAdd = document.getElementById('btnAdd');
const btnClear = document.getElementById('btnClear');
const btnSave = document.getElementById('btnSave');
const clientsList = document.getElementById('clientsList');
const empty = document.getElementById('empty');

// Modal Elements
const modal = document.getElementById('clientModal');
const modalId = document.getElementById('modalId');
const modalFlow = document.getElementById('modalFlow');
const modalEmail = document.getElementById('modalEmail');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');



const searchField = document.getElementById('searchField');
if (searchField) {
    searchField.addEventListener('input', () => {
        render();
    });
}


let clients = window.backendClients?.clients || [];
let changes = []; // Tracks {operation, data} for sending
let editIndex = null; // null means creating new

// --- Render function ---

// --- Render function with search ---
function render() {
    clientsList.innerHTML = '';

    const query = searchField?.value?.trim().toLowerCase();

    // Attach original index while filtering
    const filteredClients = clients
        .map((client, idx) => ({ client, originalIndex: idx }))
        .filter(({ client }) => {
            if (!query) return true;
            return (
                client.id.toLowerCase().includes(query) ||
                client.flow.toLowerCase().includes(query) ||
                client.email.toLowerCase().includes(query)
            );
        });

    if (filteredClients.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    filteredClients.forEach(({ client, originalIndex }) => {
        const el = document.createElement('div');
        el.className = 'client';
        el.innerHTML = `
            <div class="meta">
                <div class="name">${client.email}</div>
                <div class="small">
                    Flow: ${client.flow} | ID: ${client.id}
                </div>
            </div>
            <div class="actions">
                <button class="action-btn edit-btn">Edit</button>
                <button class="action-btn danger remove-btn">Remove</button>
            </div>
        `;

        clientsList.appendChild(el);

        // Edit button
        el.querySelector('.edit-btn').addEventListener('click', () => {
            editIndex = originalIndex; // original index in full array
            modalTitle.textContent = "Edit Client";
            client.oldid = client.id; // store old id
            modalId.value = client.id;
            modalFlow.value = client.flow;
            modalEmail.value = client.email;
            modal.setAttribute("aria-hidden", "false");
        });

        // Remove button
        el.querySelector('.remove-btn').addEventListener('click', () => {
            if (confirm("Delete this client?")) {
                changes.push({ operation: 'd', data: client });
                clients.splice(originalIndex, 1); // remove from original array
                render();
            }
        });
    });
}


// --- Modal functions ---
function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modalId.value = '';
    modalFlow.value = '';
    modalEmail.value = '';
    editIndex = null;
}

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);

// --- Add new client ---
if (btnAdd) {
    btnAdd.addEventListener('click', () => {
        editIndex = null;
        modalTitle.textContent = "Add Client";
        modalId.value = '';
        modalFlow.value = '';
        modalEmail.value = '';
        modal.setAttribute("aria-hidden", "false");
        console.log(client.email)
    });
}

// --- Modal Save ---
modalSave.addEventListener('click', () => {
    const newClient = {
        id: modalId.value.trim(),
        flow: modalFlow.value.trim(),
        email: modalEmail.value.trim()
    };
    if (!newClient.id || !newClient.flow || !newClient.email) {
        alert("All fields are required!");
        return;
    }

    if (editIndex !== null) {
        // Edit existing
        const targetId = clients[editIndex].id
        console.log(clients[editIndex].id)
        
        changes.push({ operation: 'e', data: newClient, target_id:targetId});
        clients[editIndex] = newClient;
    } else {
        // Add new
        changes.push({ operation: 'a', data: newClient });
        clients.push(newClient);
    }
    render();
    closeModal();
});

// --- Clear all ---
if (btnClear) {
    btnClear.addEventListener('click', () => {
        if (confirm("Clear all clients?")) {
            clients.forEach(c => changes.push({ operation: 'd', data: c }));
            clients = [];
            render();
        }
    });
}





const notificationContainer = document.getElementById('notificationContainer');

function showNotification(message, type = 'success', duration = 3000) {
    if (!notificationContainer) return;

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    notificationContainer.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, duration);
}




// --- Save all changes to backend ---
if (btnSave) {
    btnSave.addEventListener('click', async () => {
        if (changes.length === 0) {
            showNotification("No changes to save!");
            return;
        }

        console.log("Sending payload:", changes);

        try {
            const response = await fetch("/post_config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(changes)
            });

            if (!response.ok) {
                showNotification("Failed to save changes");
                return;
            }

            const data = await response.json();
            console.log("Server response:", data);
            showNotification("Changes saved!");
            changes = []; // reset change tracker
        } catch (err) {
            console.error("Error saving changes:", err);
            showNotification("Error saving changes");
        }
    });
}

// --- Initial render ---
render();
console.log("=== DEBUG VERSION LOADED ===");
