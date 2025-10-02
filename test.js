// Test version - paste this in browser console
function testRender() {
    // Mock data that matches your structure
    const testClients = [
        { email: "Dan_11", flow: "xtls-rprx-vision", id: "d9fdb583-fbcb-4ede-84cf-c224295f0868" },
        { email: "Dan", flow: "xtls-rprx-vision", id: "2fe4a0d9-84ad-4549-b06f-89d69dd36490" }
    ];
    
    // Mock DOM elements
    const mockClientsList = {
        innerHTML: '',
        appendChild: function(el) {
            console.log('Would append:', el.outerHTML);
        }
    };
    
    const mockEmpty = {
        style: {
            display: 'block'
        }
    };
    
    console.log('=== TESTING RENDER FUNCTION ===');
    console.log('Clients:', testClients);
    
    // Simplified render function for testing
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function renderTest(clients, clientsList, empty) {
        console.log('Starting render with', clients.length, 'clients');
        
        clientsList.innerHTML = '';
        if (clients.length === 0) {
            empty.style.display = 'block';
            console.log('No clients - showing empty message');
            return;
        }
        
        empty.style.display = 'none';
        console.log('Rendering clients list');
        
        clients.forEach((c, i) => {
            const el = document.createElement('div');
            el.className = 'client';
            el.innerHTML = `
                <div class="meta">
                    <div class="name">${escapeHtml(c.email)}</div>
                    <div class="small">${escapeHtml(c.flow)} — ${escapeHtml(c.id || '—')}</div>
                </div>
                <div class="actions">
                    <button class="action-btn" data-edit="${i}">Edit</button>
                    <button class="action-btn danger" data-remove="${i}">Remove</button>
                </div>
            `;
            console.log('Client', i, 'HTML:', el.outerHTML);
            clientsList.appendChild(el);
        });
    }
    
    // Run the test
    renderTest(testClients, mockClientsList, mockEmpty);
}

// Run the test
testRender();