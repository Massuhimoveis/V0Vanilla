// Dados simulados de clientes
const clientsData = [
    { id: 1, name: "Alex", phone: "+556181495065", email: "alex@example.com", status: "LEAD", lastEditDate: "28/10/2024" },
    { id: 2, name: "Maria", phone: "+556187654321", email: "maria@example.com", status: "PROSPECT", lastEditDate: "29/10/2024" },
    { id: 3, name: "João", phone: "+556189876543", email: "joao@example.com", status: "CLIENT", lastEditDate: "30/10/2024" },
];

// Dados simulados de tickets
const ticketsData = [
    { id: 1, clientId: 1, type: "propertyBuying", status: "AGENDAMENTO", details: "Apartamento 2 quartos, Centro", title: "IMÓVEL NO PERFIL", date: "30/10/2024" },
    { id: 2, clientId: 1, type: "carBuying", status: "EM ANÁLISE", details: "SUV, até R$ 80.000", title: "CARRO NO PERFIL", date: "30/10/2024" },
    { id: 3, clientId: 1, type: "propertySelling", status: "ABERTO", details: "Venda concluída", title: "VENDA DE IMÓVEL", date: "31/10/2024" },
];

// Elementos do DOM
const leftPanel = document.getElementById('leftPanel');
const toggleLeftPanelBtn = document.getElementById('toggleLeftPanel');
const closeLeftPanelBtn = document.getElementById('closeLeftPanel');
const clientList = document.getElementById('clientList');
const mainContent = document.getElementById('mainContent');
const toggleDarkModeBtn = document.getElementById('toggleDarkMode');

// Funções
function toggleLeftPanel() {
    leftPanel.classList.toggle('closed');
}

function renderClientList() {
    clientList.innerHTML = '';
    clientsData.forEach(client => {
        const clientElement = document.createElement('div');
        clientElement.className = 'client-item';
        clientElement.innerHTML = `
            <span>${client.name}</span>
            <span>${client.lastEditDate}</span>
        `;
        clientElement.addEventListener('click', () => selectClient(client));
        clientList.appendChild(clientElement);
    });
}

function selectClient(client) {
    mainContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2>${client.name}</h2>
            </div>
            <div class="card-content">
                <div class="accordion">
                    <div class="accordion-item">
                        <div class="accordion-header">
                            <span>Informações Pessoais</span>
                            <button class="button">Editar</button>
                        </div>
                        <div class="accordion-content">
                            <p>Telefone: ${client.phone}</p>
                            <p>Email: ${client.email}</p>
                            <p>Status: ${client.status}</p>
                        </div>
                    </div>
                    <!-- Adicione mais itens de acordeão conforme necessário -->
                </div>
            </div>
        </div>
    `;
    if (window.innerWidth < 768) {
        toggleLeftPanel();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    toggleDarkModeBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

// Event Listeners
toggleLeftPanelBtn.addEventListener('click', toggleLeftPanel);
closeLeftPanelBtn.addEventListener('click', toggleLeftPanel);
toggleDarkModeBtn.addEventListener('click', toggleDarkMode);

// Função de inicialização
function initializeApp() {
    renderClientList();
    
    // Seleciona o primeiro cliente por padrão, se houver clientes
    if (clientsData.length > 0) {
        selectClient(clientsData[0]);
    }

    // Verifica e aplica o modo escuro se estiver salvo nas preferências do usuário
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleDarkModeBtn.textContent = '☀️';
    }

    // Ajusta o layout para dispositivos móveis, se necessário
    if (window.innerWidth < 768) {
        leftPanel.classList.add('closed');
    }
}

// Chamada de inicialização
document.addEventListener('DOMContentLoaded', initializeApp);
