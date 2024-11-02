//Somente JavaScript Vanilla
// Simulated client data
const clientsData = [
    { 
        id: 1, 
        name: "Alex", 
        phone: "+556181495065", 
        email: "alex@example.com", 
        status: "LEAD",
        lastEditDate: "28/10/2024",
        propertyBuying: { 
            budget: { type: 'range', exigencia: 500000, preferencia: 550000 },
            preferredLocation: "Centro",
            squareMeterValue: { type: 'range', exigencia: 9000, preferencia: 11000 },
            paymentMethod: "Financiamento",
            valueObservations: "Negociável",
            minArea: 50,
            bedrooms: { 
                type: 'multipleChoice',
                options: ['1', '2', '3', '4+'],
                requirements: ['2'],
                preferences: ['2', '3']
            },
            suites: { 
                type: 'multipleChoice',
                options: ['0', '1', '2', '3+'],
                requirements: [],
                preferences: ['1']
            },
            bathrooms: { 
                type: 'multipleChoice',
                options: ['1', '2', '3', '4+'],
                requirements: ['2'],
                preferences: ['2', '3']
            },
            maidRoom: false,
            kitchenType: "Americana",
            elevator: true,
            floorPreference: { 
                type: 'multipleChoice',
                options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
                requirements: [],
                preferences: ['5', '6', '7', '8', '9', '10+']
            }
        },
        carBuying: { 
            model: "SUV", 
            maxPrice: 80000,
            preferredBrands: ["Toyota", "Honda"],
            fuelType: "Flex",
            yearMin: 2018
        },
        propertySelling: { 
            address: "Rua A, 123", 
            askingPrice: 450000,
            propertyType: "Apartamento",
            area: 100,
            bedrooms: 3,
            bathrooms: 2
        },
    },
    { id: 2, name: "Maria", phone: "+556187654321", email: "maria@example.com", status: "PROSPECT", lastEditDate: "29/10/2024" },
    { id: 3, name: "João", phone: "+556189876543", email: "joao@example.com", status: "CLIENT", lastEditDate: "30/10/2024" },
];

// Simulated ticket data
const ticketsData = [
    { id: 1, clientId: 1, type: "propertyBuying", status: "AGENDAMENTO", details: "Apartamento 2 quartos, Centro", title: "IMÓVEL NO PERFIL", date: "30/10/2024", dataPrincipal: "29/10/2024 10:11", dataReserva: "30/10/2024 10:11" },
    { id: 2, clientId: 1, type: "carBuying", status: "EM ANÁLISE", details: "SUV, até R$ 80.000", title: "CARRO NO PERFIL", date: "30/10/2024" },
    { id: 3, clientId: 1, type: "propertySelling", status: "ABERTO", details: "Venda concluída", title: "VENDA DE IMÓVEL", date: "31/10/2024" },
    { id: 4, clientId: 2, type: "propertyBuying", status: "NÃO ATENDE", details: "Casa 3 quartos, Jardim Botânico", title: "IMÓVEL FORA DO PERFIL", date: "01/11/2024" },
    { id: 5, clientId: 3, type: "carBuying", status: "ENVIADO E AGUARDANDO RETORNO", details: "Sedan, até R$ 100.000", title: "CARRO LUXO", date: "02/11/2024" },
];

// Update the ticketsData array to set all existing tickets as "TAREFA" type
ticketsData.forEach(ticket => {
    if (!ticket.title.includes(' - ')) {
        if (ticket.type === 'propertyBuying') {
            ticket.title = `TAREFA  - ${ticket.type === 'propertyBuying' ? 'COMPRA' : 'VENDA'} - IMÓVEL`;
        } else if (ticket.type === 'carBuying') {
            ticket.title = 'TAREFA - COMPRA - CARRO';
        } else if (ticket.type === 'propertySelling') {
            ticket.title = 'TAREFA - VENDA - IMÓVEL';
        }
    }
});

// Predefined fields for each profile type
const predefinedFields = {
    propertyBuying: [
        "Valor acima do orçamento",
        "Localização não desejada",
        "Tamanho inadequado",
        "Falta de características desejadas",
        "Condições de pagamento incompatíveis",
        "Outro"
    ],
    carBuying: [
        "Preço acima do orçamento",
        "Modelo indisponível",
        "Marca não preferida",
        "Ano do veículo inadequado",
        "Tipo de combustível incompatível",
        "Outro"
    ],
    propertySelling: [
        "Valor de venda abaixo do esperado",
        "Localização não atrativa para compradores",
        "Tamanho do imóvel inadequado para o mercado",
        "Condições do imóvel não satisfatórias",
        "Documentação incompleta",
        "Outro"
    ]
};

// Global variables
let isLeftPanelOpen = true;
let isDarkMode = false;
let selectedClient = null;
let isFullscreen = false;
let selectedTicket = null;
let isEditing = false;
let editedProfile = {};
let pendingTickets = { propertyBuying: 0, carBuying: 0, propertySelling: 0 };
let selectedPredefinedField = "";
let predefinedFieldValue = "";
let currentProfileType = "propertyBuying";
let ticketFilter = "active";
let categoryFilter = "ALL";
let accordionItems = [
    { id: "personal", title: "Informações Pessoais", content: [], pendingCount: 0 },
    { id: "propertyBuying", title: "TAREFA - COMPRA - IMÓVEL", content: [], pendingCount: 1 },
    { id: "carBuying", title: "TAREFA - COMPRA - CARRO", content: [], pendingCount: 2 },
    { id: "propertySelling", title: "TAREFA - VENDA - IMÓVEL", content: [], pendingCount: 1 },
];

// DOM Elements
const leftPanel = document.getElementById('leftPanel');
const toggleLeftPanelBtn = document.getElementById('toggleLeftPanel');
const closeLeftPanelBtn = document.getElementById('closeLeftPanel');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');
const clientList = document.getElementById('clientList');
const mainContent = document.getElementById('mainContent');
const clientDetails = document.getElementById('clientDetails');
const noClientSelected = document.getElementById('noClientSelected');
const clientNameElement = document.getElementById('clientName');
const accordion = document.getElementById('accordion');
const addNewTabBtn = document.getElementById('addNewTab');
const categoryFilterSelect = document.getElementById('categoryFilter');
const ticketFilterSelect = document.getElementById('ticketFilter');
const newTicketDialog = document.getElementById('newTicketDialog');
const createNewTicketBtn = document.getElementById('createNewTicket');
const closeNewTicketDialogBtn = document.getElementById('closeNewTicketDialog');

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
toggleLeftPanelBtn.addEventListener('click', toggleLeftPanel);
closeLeftPanelBtn.addEventListener('click', toggleLeftPanel);
toggleDarkModeBtn.addEventListener('click', toggleDarkMode);
addNewTabBtn.addEventListener('click', showNewTicketDialog);
categoryFilterSelect.addEventListener('change', handleCategoryFilterChange);
ticketFilterSelect.addEventListener('change', handleTicketFilterChange);
createNewTicketBtn.addEventListener('click', handleCreateNewTicket);
closeNewTicketDialogBtn.addEventListener('click', hideNewTicketDialog);

// Functions
function initApp() {
    renderClientList();
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    lucide.createIcons();
}

function checkScreenSize() {
    isFullscreen = window.innerWidth >= 768;
    if (isFullscreen) {
        leftPanel.classList.add('open');
        mainContent.classList.add('shifted');
    } else {
        leftPanel.classList.remove('open');
        mainContent.classList.remove('shifted');
    }
}

function toggleLeftPanel() {
    isLeftPanelOpen = !isLeftPanelOpen;
    leftPanel.classList.toggle('open');
    if (isFullscreen) {
        mainContent.classList.toggle('shifted');
    }
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    toggleDarkModeBtn.innerHTML = isDarkMode ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    lucide.createIcons();
}

function renderClientList() {
    clientList.innerHTML = '';
    clientsData.forEach(client => {
        const clientElement = document.createElement('div');
        clientElement.className = 'client-item';
        clientElement.innerHTML = `
            <span>${client.name}</span>
            <span class="client-date">${client.lastEditDate}</span>
        `;
        clientElement.addEventListener('click', () => handleClientSelect(client));
        clientList.appendChild(clientElement);
    });
}

function handleClientSelect(client) {
    selectedClient = client;
    selectedTicket = null;
    isEditing = false;
    editedProfile = client[currentProfileType] || {};
    renderClientDetails();
    if (!isFullscreen) {
        toggleLeftPanel();
    }
}

function renderClientDetails() {
    if (selectedClient) {
        clientDetails.classList.remove('hidden');
        noClientSelected.classList.add('hidden');
        clientNameElement.textContent = selectedClient.name;
        renderAccordion();
        updatePendingTickets();
    } else {
        clientDetails.classList.add('hidden');
        noClientSelected.classList.remove('hidden');
    }
}

function renderAccordion() {
    accordion.innerHTML = '';
    accordionItems
        .filter(item => categoryFilter === "ALL" || item.title.includes(categoryFilter))
        .forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            accordionItem.innerHTML = `
                <div class="accordion-header">
                    <span>${item.title}</span>
                    ${item.pendingCount > 0 ? `<span class="badge">${item.pendingCount}</span>` : ''}
                    <button class="icon-button edit-button"><i data-lucide="edit"></i></button>
                </div>
                <div class="accordion-content"></div>
            `;
            const header = accordionItem.querySelector('.accordion-header');
            const content = accordionItem.querySelector('.accordion-content');
            const editButton = accordionItem.querySelector('.edit-button');

            header.addEventListener('click', () => toggleAccordionItem(content));
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                handleEditToggle();
            });

            if (item.id === "personal") {
                renderPersonalInfo(content);
            } else {
                renderTickets(item.id, content);
            }

            accordion.appendChild(accordionItem);
        });
    lucide.createIcons();
}

function toggleAccordionItem(content) {
    content.classList.toggle('open');
}

function renderPersonalInfo(container) {
    if (isEditing) {
        container.innerHTML = `
            <div class="personal-info-edit">
                ${renderProfileFields()}
                ${renderPredefinedFieldsSelector()}
            </div>
        `;
    } else {
        container.innerHTML = `
            <table class="table">
                <tr><td>Nome</td><td>${selectedClient.name}</td></tr>
                <tr><td>Telefone</td><td>${selectedClient.phone}</td></tr>
                <tr><td>Email</td><td>${selectedClient.email}</td></tr>
                <tr><td>Status</td><td>${selectedClient.status}</td></tr>
            </table>
        `;
    }
}

function renderProfileFields() {
    return Object.entries(editedProfile).map(([field, value]) => {
        if (typeof value === 'object' && value.type === 'multipleChoice') {
            return `
                <div class="field">
                    <label for="${field}">${field}</label>
                    <button class="multiple-choice-button" data-field="${field}">
                        ${value.requirements.length > 0 ? `Exigências: ${value.requirements.join(', ')}` : 'Sem exigências'}
                        ${value.preferences.length > 0 ? ` | Preferências: ${value.preferences.join(', ')}` : ''}
                    </button>
                </div>
            `;
        } else if (typeof value === 'object' && value.type === 'range') {
            return `
                <div class="field">
                    <label for="${field}">${field}</label>
                    <div class="range-inputs">
                        <input type="number" id="${field}-exigencia" value="${value.exigencia || ''}" placeholder="Exigência">
                        <input type="number" id="${field}-preferencia" value="${value.preferencia || ''}" placeholder="Preferência">
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="field">
                    <label for="${field}">${field}</label>
                    <input type="${typeof value === 'number' ? 'number' : 'text'}" id="${field}" value="${value}">
                </div>
            `;
        }
    }).join('');
}

function renderPredefinedFieldsSelector() {
    return `
        <div class="predefined-fields">
            <select id="predefinedFieldSelect">
                <option value="">Selecione um campo</option>
                ${predefinedFields[currentProfileType].map(field => `<option value="${field}">${field}</option>`).join('')}
            </select>
            <input type="text" id="predefinedFieldValue" placeholder="Valor do campo">
            <button id="addPredefinedField">Adicionar</button>
        </div>
    `;
}

function renderTickets(type, container) {
    const clientTickets = ticketsData.filter(ticket => 
        ticket.clientId === selectedClient.id && 
        ticket.type === type &&
        (ticketFilter === "active" ? ticket.status !== "DESCARTADO" : ticket.status === "DESCARTADO")
    );

    if (clientTickets.length > 0) {
        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>TÍTULO</th>
                        <th>DATA</th>
                        <th>SITUAÇÃO</th>
                        <th>PENDÊNCIA</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientTickets.map(ticket => `
                        <tr data-ticket-id="${ticket.id}">
                            <td>${ticket.title}</td>
                            <td>
                                <input type="date" value="${ticket.date.split('/').reverse().join('-')}" class="date-input ${getDateColor(ticket.date)}">
                            </td>
                            <td>
                                <select class="status-select">
                                    ${renderStatusOptions(ticket)}
                                </select>
                            </td>
                            <td>
                                ${renderPendingIcon(ticket)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Add event listeners
        container.querySelectorAll('.date-input').forEach(input => {
            input.addEventListener('change', (e) => handleDateChange(e.target));
        });

        container.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => handleTicketStatusChange(e.target));
        });

        container.querySelectorAll('tr[data-ticket-id]').forEach(row => {
            row.addEventListener('click', () => handleTicketSelect(row.dataset.ticketId));
        });
    } else {
        container.innerHTML = '<p>Nenhum ticket disponível para este perfil.</p>';
    }
}

function renderStatusOptions(ticket) {
    const options = [
        `<option value="${ticket.status}" selected>${ticket.status}</option>`
    ];

    if (ticket.status === "ABERTO") {
        options.push('<option value="EM ANÁLISE">EM ANÁLISE</option>');
    }

    if (ticket.status === "ABERTO" || ticket.status === "EM ANÁLISE") {
        options.push('<option value="ENVIADO E AGUARDANDO RETORNO">ENVIADO E AGUARDANDO RETORNO</option>');
    }

    if (ticket.status !== "AGENDAMENTO") {
        options.push('<option value="NÃO ATENDE">NÃO ATENDE</option>');
    }

    options.push('<option value="AGENDAMENTO">AGENDAMENTO</option>');

    if (ticket.resultadoVisita === "POSSIBILIDADE DE COMPRA") {
        options.push(
            '<option value="💰 NEGOCIAÇÃO DE VALORES">💰 NEGOCIAÇÃO DE VALORES</option>',
            '<option value="📄 BUROCRÁTICO">📄 BUROCRÁTICO</option>'
        );
    }

    return options.join('');
}

function renderPendingIcon(ticket) {
    if (ticket.status === "ABERTO" || 
        ticket.status === "EM ANÁLISE" ||
        ticket.status === "ENVIADO E AGUARDANDO RETORNO" ||
        (ticket.status === "AGENDAMENTO" && !ticket.dataPrincipal) ||
        (ticket.status === "NÃO ATENDE" && !ticket.motivoNaoAtende)) {
        return '<i data-lucide="alert-triangle" class="text-yellow-500"></i>';
    }
    return '';
}

function getDateColor(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [day, month, year] = date.split('/');
    const ticketDate = new Date(year, month - 1, day);
    ticketDate.setHours(0, 0, 0, 0);
    
    if (ticketDate < today) return 'text-red-500';
    if (ticketDate.getTime() === today.getTime()) return 'text-yellow-500';
    return 'text-green-500';
}

function handleDateChange(input) {
    const [year, month, day] = input.value.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const ticketId = parseInt(input.closest('tr').dataset.ticketId);
    
    const updatedTicket = ticketsData.find(ticket => ticket.id === ticketId);
    if (updatedTicket) {
        updatedTicket.date = formattedDate;
        input.className = `date-input ${getDateColor(formattedDate)}`;
        updatePendingTickets();
    }
}

function handleTicketStatusChange(select) {
    const ticketId = parseInt(select.closest('tr').dataset.ticketId);
    const newStatus =
