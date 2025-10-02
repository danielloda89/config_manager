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

let clients = window.backendClients?.clients || [];
let changes = []; // Tracks {operation, data} for sending
let editIndex = null; // null means creating new

// --- Render function ---
function render() {
    clientsList.innerHTML = '';
    if (clients.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    clients.forEach((client, index) => {
        const el = document.createElement('div');
        el.className = 'client';
        el.innerHTML = `
            <div class="meta">
                <div class="name">${client.id}</div>
                <div class="small">
                    Flow: ${client.flow} | Email: ${client.email}
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
            editIndex = index;
            modalTitle.textContent = "Edit Client";
            modalId.value = client.id;
            modalFlow.value = client.flow;
            modalEmail.value = client.email;
            modal.setAttribute("aria-hidden", "false");
        });

        // Remove button
        el.querySelector('.remove-btn').addEventListener('click', () => {
            if (confirm("Delete this client?")) {
                changes.push({ operation: 'd', data: client });
                clients.splice(index, 1);
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
        changes.push({ operation: 'e', data: newClient });
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

// --- Save all changes to backend ---
if (btnSave) {
    btnSave.addEventListener('click', async () => {
        if (changes.length === 0) {
            alert("No changes to save!");
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
                alert("Failed to save changes");
                return;
            }

            const data = await response.json();
            console.log("Server response:", data);
            alert("Changes saved!");
            changes = []; // reset change tracker
        } catch (err) {
            console.error("Error saving changes:", err);
            alert("Error saving changes");
        }
    });
}

// --- Initial render ---
render();
console.log("=== DEBUG VERSION LOADED ===");
