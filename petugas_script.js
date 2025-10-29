document.addEventListener('DOMContentLoaded', function() {
    // Initialize petugas panel
    initializePetugasPanel();

    // Set up event listeners
    setupEventListeners();

    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Initialize petugas panel
function initializePetugasPanel() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('petugasLoggedIn');
    if (isLoggedIn) {
        showPetugasPanel();
        loadPetugasData();
    }
}

// Show petugas panel and hide login
function showPetugasPanel() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
}

// Show login and hide petugas panel
function showLoginPanel() {
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

// Update date and time
function updateDateTime() {
    const now = new Date();

    // Format time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Format date: Day, DD Month YYYY
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const dateString = `${day}, ${date} ${month} ${year}`;

    // Update DOM
    document.getElementById('admin-current-time').textContent = timeString;
    document.getElementById('admin-current-date').textContent = dateString;
}

// Load petugas data
function loadPetugasData() {
    // Load instansi name
    const instansiNama = localStorage.getItem('instansiNama') || 'Dinas Perhubungan Kab.Semarang';
    document.getElementById('admin-instansi-nama').textContent = instansiNama;

    // Load queue data
    const currentQueue = localStorage.getItem('currentQueue') || '-';
    document.getElementById('admin-current-number').textContent = currentQueue;

    // Load queue note
    const queueNote = localStorage.getItem('queueNote') || 'Silakan menunggu nomor antrian Anda dipanggil';
    document.getElementById('queue-note-input').value = queueNote;

    // Load queue statistics
    const totalQueue = parseInt(localStorage.getItem('totalQueue') || '0');
    const processedQueue = parseInt(localStorage.getItem('processedQueue') || '0');
    const remainingQueue = parseInt(localStorage.getItem('remainingQueue') || '0');

    document.getElementById('total-queue').textContent = totalQueue;
    document.getElementById('processed-queue').textContent = processedQueue;
    document.getElementById('remaining-queue').textContent = remainingQueue;

    // Load and display queue list
    loadQueueList();

    // Load and display history
    loadHistory();
}

// Call next queue
function callNextQueue() {
    console.log('callNextQueue function called');
    const currentQueue = localStorage.getItem('currentQueue') || '-';
    console.log('currentQueue:', currentQueue);
    if (currentQueue !== '-') {
        console.log('Showing alert because currentQueue is not completed');
        alert('Harap selesaikan antrian saat ini terlebih dahulu dengan menekan \'Antrian Selesai\'.');
        return;
    }
    let queueList = JSON.parse(localStorage.getItem('queueList')) || [];

    if (queueList.length > 0) {
        // Get next queue number
        const nextQueue = queueList.shift();

        // Update current queue
        localStorage.setItem('currentQueue', nextQueue);
        document.getElementById('admin-current-number').textContent = nextQueue;

        // Update queue list
        localStorage.setItem('queueList', JSON.stringify(queueList));

        // Update statistics
        const totalQueue = parseInt(localStorage.getItem('totalQueue') || '0') + 1;
        const processedQueue = parseInt(localStorage.getItem('processedQueue') || '0') + 1;
        const remainingQueue = queueList.length;

        localStorage.setItem('totalQueue', totalQueue.toString());
        localStorage.setItem('processedQueue', processedQueue.toString());
        localStorage.setItem('remainingQueue', remainingQueue.toString());

        document.getElementById('total-queue').textContent = totalQueue;
        document.getElementById('processed-queue').textContent = processedQueue;
        document.getElementById('remaining-queue').textContent = remainingQueue;

        // Update queue list display
        loadQueueList();

        // Announce the next queue
        speakText(`Panggilan nomor antrian ${nextQueue} silahkan menuju ruangan uji.`);
    } else {
        alert('Tidak ada antrian berikutnya.');
    }
}

// Reset queue
function resetQueue() {
    if (confirm('Apakah Anda yakin ingin mereset seluruh antrian?')) {
        localStorage.setItem('currentQueue', '-');
        localStorage.setItem('queueList', JSON.stringify([]));
        localStorage.setItem('totalQueue', '0');
        localStorage.setItem('processedQueue', '0');
        localStorage.setItem('remainingQueue', '0');
        localStorage.setItem('angkutanQueue', '0');
        localStorage.setItem('barangQueue', '0');

        document.getElementById('admin-current-number').textContent = '-';
        document.getElementById('total-queue').textContent = '0';
        document.getElementById('processed-queue').textContent = '0';
        document.getElementById('remaining-queue').textContent = '0';

        // Update queue list display
        loadQueueList();

        alert('Antrian telah direset.');
    }
}

// Update queue note
function updateQueueNote() {
    const note = document.getElementById('queue-note-input').value;
    localStorage.setItem('queueNote', note);
    alert('Catatan antrian telah diperbarui.');
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const errorElement = document.getElementById('password-error');
    const successElement = document.getElementById('password-success');

    errorElement.textContent = '';
    successElement.textContent = '';

    // Get stored password hash
    const storedHash = localStorage.getItem('petugasPasswordHash') || hashPassword('petugas123');

    // Verify current password
    if (hashPassword(currentPassword) !== storedHash) {
        errorElement.textContent = 'Password saat ini tidak valid!';
        return;
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        errorElement.textContent = 'Password baru dan konfirmasi tidak cocok!';
        return;
    }

    // Check password strength
    if (newPassword.length < 6) {
        errorElement.textContent = 'Password baru terlalu pendek (minimal 6 karakter)!';
        return;
    }

    // Save new password
    localStorage.setItem('petugasPasswordHash', hashPassword(newPassword));
    successElement.textContent = 'Password berhasil diubah!';

    // Clear form
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

// Login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');

    // Get petugas list from localStorage
    const petugasList = JSON.parse(localStorage.getItem('petugasList')) || [
        { username: 'petugas1', passwordHash: hashPassword('password1') },
        { username: 'petugas2', passwordHash: hashPassword('password2') }
    ];

    // Check if username and password match any petugas
    const petugas = petugasList.find(p => p.username === username && p.passwordHash === hashPassword(password));

    if (petugas) {
        sessionStorage.setItem('petugasLoggedIn', 'true');
        sessionStorage.setItem('currentPetugas', username);
        showPetugasPanel();
        loadPetugasData();
        errorElement.textContent = '';
    } else {
        errorElement.textContent = 'Username atau password tidak valid!';
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('petugasLoggedIn');
    showLoginPanel();
}

// Hash password (simple hash for demo purposes)
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

// Setup event listeners
function setupEventListeners() {
    // Listen for localStorage changes to auto-update queue list and statistics
    window.addEventListener('storage', function(e) {
        if (e.key === 'queueList' || e.key === 'currentQueue' || e.key === 'totalQueue' || e.key === 'processedQueue' || e.key === 'remainingQueue' || e.key === 'angkutanQueue' || e.key === 'barangQueue') {
            loadPetugasData();
        }
        if (e.key === 'queueHistory') {
            loadHistory();
        }
    });

    // Login
    document.getElementById('login-btn').addEventListener('click', login);

    // Sidebar navigation
    document.querySelectorAll('.sidebar-btn').forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');

            // Hide all sections
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            document.getElementById(target).classList.add('active');

            // Update active button
            document.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Queue management
    document.getElementById('complete-queue-btn').addEventListener('click', completeQueue);
    document.getElementById('call-next-btn').addEventListener('click', callNextQueue);
    document.getElementById('reset-queue-btn').addEventListener('click', resetQueue);
    document.getElementById('update-note-btn').addEventListener('click', updateQueueNote);

    // System settings
    document.getElementById('change-password-btn').addEventListener('click', changePassword);

    // History filters
    document.getElementById('history-filter').addEventListener('change', filterHistory);
    document.getElementById('history-status-filter').addEventListener('change', filterHistory);
    document.getElementById('history-date-filter').addEventListener('change', filterHistory);

    // Download buttons
    document.getElementById('download-pdf-btn').addEventListener('click', downloadHistoryPDF);
    document.getElementById('download-excel-btn').addEventListener('click', downloadHistoryExcel);

    // Username and password inputs - submit on Enter
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });

    // Password visibility toggle
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'Show';
    toggleBtn.id = 'toggle-password';
    toggleBtn.style.fontSize = '12px';
    toggleBtn.style.padding = '2px 5px';
    toggleBtn.style.marginRight = '5px';
    passwordInput.parentNode.insertBefore(toggleBtn, passwordInput);

    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? 'Show' : 'Hide';
    });
}

// Load and display queue list
function loadQueueList() {
    const queueListDisplay = document.getElementById('queue-list-display');
    const queueList = JSON.parse(localStorage.getItem('queueList')) || [];

    queueListDisplay.innerHTML = '';

    if (queueList.length === 0) {
        queueListDisplay.innerHTML = '<p>Tidak ada antrian saat ini.</p>';
        return;
    }

    queueList.forEach((queueNumber, index) => {
        const queueItem = document.createElement('div');
        queueItem.className = 'queue-item';
        queueItem.innerHTML = `
            <span class="queue-number">${queueNumber}</span>
            <span class="queue-position">Posisi: ${index + 1}</span>
        `;
        queueListDisplay.appendChild(queueItem);
    });
}

// Complete queue
function completeQueue() {
    const currentQueue = localStorage.getItem('currentQueue');
    if (currentQueue && currentQueue !== '-') {
        // Add to history with status "Selesai"
        const queueHistory = JSON.parse(localStorage.getItem('queueHistory')) || [];
        const jenisAngkutan = currentQueue.startsWith('B') ? 'Angkutan Barang' : 'Angkutan Umum';

        queueHistory.push({
            number: currentQueue,
            type: jenisAngkutan,
            status: 'Selesai',
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('queueHistory', JSON.stringify(queueHistory));

        // Clear current queue
        localStorage.setItem('currentQueue', '-');
        document.getElementById('admin-current-number').textContent = '-';

        alert(`Antrian ${currentQueue} telah selesai dan ditambahkan ke riwayat.`);
    } else {
        alert('Tidak ada antrian saat ini untuk diselesaikan.');
    }
}

// Speech functionality
function speakText(text) {
    // Using the free Web Speech API
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'id-ID';
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

// Load and display history
function loadHistory() {
    const historyTableBody = document.getElementById('history-table-body');
    const noHistoryElement = document.getElementById('no-history');
    const queueHistory = JSON.parse(localStorage.getItem('queueHistory')) || [];

    historyTableBody.innerHTML = '';

    if (queueHistory.length === 0) {
        noHistoryElement.style.display = 'block';
        return;
    }

    noHistoryElement.style.display = 'none';

    // Sort history by timestamp (newest first)
    queueHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    queueHistory.forEach((item, index) => {
        const row = document.createElement('tr');
        const timestamp = new Date(item.timestamp);
        const formattedDate = timestamp.toLocaleDateString('id-ID');
        const formattedTime = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.number}</td>
            <td>${item.type}</td>
            <td>${item.status}</td>
            <td>${formattedDate} ${formattedTime}</td>
        `;
        historyTableBody.appendChild(row);
    });
}

// Filter history
function filterHistory() {
    const typeFilter = document.getElementById('history-filter').value;
    const statusFilter = document.getElementById('history-status-filter').value;
    const dateFilter = document.getElementById('history-date-filter').value;
    const historyTableBody = document.getElementById('history-table-body');
    const noHistoryElement = document.getElementById('no-history');
    const queueHistory = JSON.parse(localStorage.getItem('queueHistory')) || [];

    historyTableBody.innerHTML = '';

    let filteredHistory = queueHistory;

    // Filter by type
    if (typeFilter !== 'all') {
        filteredHistory = filteredHistory.filter(item => item.type === typeFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
        filteredHistory = filteredHistory.filter(item => item.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
        filteredHistory = filteredHistory.filter(item => {
            const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
            return itemDate === dateFilter;
        });
    }

    if (filteredHistory.length === 0) {
        noHistoryElement.style.display = 'block';
        return;
    }

    noHistoryElement.style.display = 'none';

    // Sort filtered history by timestamp (newest first)
    filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    filteredHistory.forEach((item, index) => {
        const row = document.createElement('tr');
        const timestamp = new Date(item.timestamp);
        const formattedDate = timestamp.toLocaleDateString('id-ID');
        const formattedTime = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.number}</td>
            <td>${item.type}</td>
            <td>${item.status}</td>
            <td>${formattedDate} ${formattedTime}</td>
        `;
        historyTableBody.appendChild(row);
    });
}

// Download history as PDF
function downloadHistoryPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const instansiNama = localStorage.getItem('instansiNama') || 'Dinas Perhubungan Kab.Semarang';
    const currentDate = new Date().toLocaleDateString('id-ID');

    doc.setFontSize(16);
    doc.text(instansiNama, 20, 20);
    doc.setFontSize(14);
    doc.text('Riwayat Antrian', 20, 35);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${currentDate}`, 20, 45);

    const queueHistory = JSON.parse(localStorage.getItem('queueHistory')) || [];
    if (queueHistory.length === 0) {
        doc.text('Belum ada riwayat antrian.', 20, 60);
    } else {
        // Sort history by timestamp (newest first)
        queueHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        let yPosition = 60;
        doc.setFontSize(8);
        doc.text('No', 20, yPosition);
        doc.text('Nomor Antrian', 35, yPosition);
        doc.text('Jenis Angkutan', 70, yPosition);
        doc.text('Status', 110, yPosition);
        doc.text('Timestamp', 140, yPosition);
        yPosition += 10;

        queueHistory.forEach((item, index) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            const timestamp = new Date(item.timestamp);
            const formattedDate = timestamp.toLocaleDateString('id-ID');
            const formattedTime = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            doc.text(`${index + 1}`, 20, yPosition);
            doc.text(item.number, 35, yPosition);
            doc.text(item.type, 70, yPosition);
            doc.text(item.status, 110, yPosition);
            doc.text(`${formattedDate} ${formattedTime}`, 140, yPosition);
            yPosition += 8;
        });
    }

    doc.save(`riwayat_antrian_${currentDate.replace(/\//g, '-')}.pdf`);
}

// Download history as Excel
function downloadHistoryExcel() {
    const queueHistory = JSON.parse(localStorage.getItem('queueHistory')) || [];
    const currentDate = new Date().toLocaleDateString('id-ID');

    if (queueHistory.length === 0) {
        alert('Belum ada riwayat antrian untuk didownload.');
        return;
    }

    // Sort history by timestamp (newest first)
    queueHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const data = queueHistory.map((item, index) => {
        const timestamp = new Date(item.timestamp);
        const formattedDate = timestamp.toLocaleDateString('id-ID');
        const formattedTime = timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        return {
            'No': index + 1,
            'Nomor Antrian': item.number,
            'Jenis Angkutan': item.type,
            'Status': item.status,
            'Tanggal': formattedDate,
            'Waktu': formattedTime
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Antrian');
    XLSX.writeFile(workbook, `riwayat_antrian_${currentDate.replace(/\//g, '-')}.xlsx`);
}
