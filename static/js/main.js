
        // --- DOM Elements ---
        const loginSection = document.getElementById('loginSection');
        const registerSection = document.getElementById('registerSection');
        const eventsSection = document.getElementById('eventsSection');

        const loginNavBtn = document.getElementById('loginNavBtn');
        const registerNavBtn = document.getElementById('registerNavBtn');
        const eventsNavBtn = document.getElementById('eventsNavBtn');
        const logoutNavBtn = document.getElementById('logoutNavBtn');

        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const passwordMatchError = document.getElementById('passwordMatchError');

        const eventModal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const eventForm = document.getElementById('eventForm');
        const eventIdInput = document.getElementById('eventId');
        const eventTitleInput = document.getElementById('eventTitle');
        const eventDateInput = document.getElementById('eventDate');
        const eventDescriptionInput = document.getElementById('eventDescription');
        const saveEventBtn = document.getElementById('saveEventBtn'); // Added to reference the save button

        const eventsList = document.getElementById('eventsList');
        const searchEventInput = document.getElementById('searchEvent');
        const sortEventsSelect = document.getElementById('sortEvents');

        const reminderModal = document.getElementById('reminderModal');
        const reminderEventTitle = document.getElementById('reminderEventTitle');
        const reminderDateTimeInput = document.getElementById('reminderDateTime');
        const reminderForm = document.getElementById('reminderForm');

        let currentUser = null; // Stores the email of the logged-in user
        let events = []; // Stores events for the current user

        // --- Initial Setup ---
        document.addEventListener('DOMContentLoaded', () => {
            checkLoginStatus();
        });

        function checkLoginStatus() {
            currentUser = localStorage.getItem('loggedInUser');
            if (currentUser) {
                loadUserEvents();
                showSection('events');
                updateNavButtons(true);
            } else {
                showSection('login');
                updateNavButtons(false);
            }
        }

        function updateNavButtons(loggedIn) {
            if (loggedIn) {
                loginNavBtn.classList.add('hidden');
                registerNavBtn.classList.add('hidden');
                eventsNavBtn.classList.remove('hidden');
                logoutNavBtn.classList.remove('hidden');
                eventsNavBtn.classList.add('active'); // Default to events view
            } else {
                loginNavBtn.classList.remove('hidden');
                registerNavBtn.classList.remove('hidden');
                eventsNavBtn.classList.add('hidden');
                logoutNavBtn.classList.add('hidden');
                loginNavBtn.classList.add('active'); // Default to login view
                registerNavBtn.classList.remove('active');
                eventsNavBtn.classList.remove('active');
            }
        }

        function showSection(section) {
            loginSection.classList.add('hidden');
            registerSection.classList.add('hidden');
            eventsSection.classList.add('hidden');

            loginNavBtn.classList.remove('active');
            registerNavBtn.classList.remove('active');
            eventsNavBtn.classList.remove('active');

            if (section === 'login') {
                loginSection.classList.remove('hidden');
                loginNavBtn.classList.add('active');
            } else if (section === 'register') {
                registerSection.classList.remove('hidden');
                registerNavBtn.classList.add('active');
            } else if (section === 'events') {
                eventsSection.classList.remove('hidden');
                eventsNavBtn.classList.add('active');
                displayEvents(); // Refresh events when showing the section
            }
        }

        // --- Navigation Event Listeners ---
        loginNavBtn.addEventListener('click', () => showSection('login'));
        registerNavBtn.addEventListener('click', () => showSection('register'));
        eventsNavBtn.addEventListener('click', () => showSection('events'));
        logoutNavBtn.addEventListener('click', logout);

        // --- User Authentication ---
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            const user = JSON.parse(localStorage.getItem(email));

            if (user && user.password === password) {
                localStorage.setItem('loggedInUser', email);
                currentUser = email;
                loadUserEvents();
                showSection('events');
                updateNavButtons(true);
                alert('Login successful!');
            } else {
                alert('Invalid email or password!');
            }
            loginForm.reset();
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('registerFullName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                passwordMatchError.classList.remove('hidden');
                return;
            } else {
                passwordMatchError.classList.add('hidden');
            }

            if (localStorage.getItem(email)) {
                alert('Account with this email already exists!');
                return;
            }

            localStorage.setItem(email, JSON.stringify({ fullName, password, events: [] }));
            alert('Registration successful! Please log in.');
            showSection('login');
            registerForm.reset();
        });

        function showRegister() {
            showSection('register');
        }

        function showLogin() {
            showSection('login');
        }

        function logout() {
            localStorage.removeItem('loggedInUser');
            currentUser = null;
            events = [];
            showSection('login');
            updateNavButtons(false);
            alert('You have been logged out.');
        }

        // --- Event Management ---
        function loadUserEvents() {
            if (currentUser) {
                const userData = JSON.parse(localStorage.getItem(currentUser));
                events = userData.events || [];
                displayEvents();
            }
        }

        function saveUserEvents() {
            if (currentUser) {
                const userData = JSON.parse(localStorage.getItem(currentUser));
                userData.events = events;
                localStorage.setItem(currentUser, JSON.stringify(userData));
            }
        }

        function displayEvents() {
            eventsList.innerHTML = '';
            const filteredAndSortedEvents = getFilteredAndSortedEvents();

            if (filteredAndSortedEvents.length === 0) {
                eventsList.innerHTML = '<li class="text-center" style="padding: 20px; color: #888;">No events found. Add a new one!</li>';
                return;
            }

            filteredAndSortedEvents.forEach(event => {
                const li = document.createElement('li');
                li.className = 'event-item';
                li.innerHTML = `
                    <span class="title">${event.title}</span>
                    <span class="date">${event.date}</span>
                    <div class="event-actions">
                        <button class="edit-btn" onclick="openEventModal('edit', '${event.id}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="reminder-btn" onclick="openReminderModal('${event.id}')"><i class="fas fa-bell"></i> Reminder</button>
                        <button class="delete-btn" onclick="deleteEvent('${event.id}')"><i class="fas fa-trash-alt"></i> Delete</button>
                    </div>
                `;
                eventsList.appendChild(li);
            });
        }

        function getFilteredAndSortedEvents() {
            let currentEvents = [...events]; // Create a copy to avoid modifying original array during filtering/sorting

            // Filter
            const searchTerm = searchEventInput.value.toLowerCase();
            if (searchTerm) {
                currentEvents = currentEvents.filter(event =>
                    event.title.toLowerCase().includes(searchTerm) ||
                    event.description.toLowerCase().includes(searchTerm)
                );
            }

            // Sort
            const sortOption = sortEventsSelect.value;
            currentEvents.sort((a, b) => {
                if (sortOption === 'date-asc') {
                    return new Date(b.date) - new Date(a.date); // Newest first
                } else if (sortOption === 'date-desc') {
                    return new Date(a.date) - new Date(b.date); // Oldest first
                } else if (sortOption === 'title-asc') {
                    return a.title.localeCompare(b.title);
                } else if (sortOption === 'title-desc') {
                    return b.title.localeCompare(a.title);
                }
                return 0;
            });
            return currentEvents;
        }

        // --- Event Modal (Add/Edit) ---
        function openEventModal(mode, eventId = '') {
            eventForm.reset();
            eventIdInput.value = '';
            if (mode === 'add') {
                modalTitle.textContent = 'Add New Event';
                saveEventBtn.innerHTML = '<i class="fas fa-plus"></i> Add Event';
            } else if (mode === 'edit') {
                modalTitle.textContent = 'Edit Event';
                saveEventBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
                const eventToEdit = events.find(e => e.id === eventId);
                if (eventToEdit) {
                    eventIdInput.value = eventToEdit.id;
                    eventTitleInput.value = eventToEdit.title;
                    eventDateInput.value = eventToEdit.date;
                    eventDescriptionInput.value = eventToEdit.description;
                }
            }
            eventModal.style.display = 'flex';
        }

        function closeEventModal() {
            eventModal.style.display = 'none';
        }

        eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = eventIdInput.value || Date.now().toString(); // Unique ID for new events
            const title = eventTitleInput.value;
            const date = eventDateInput.value;
            const description = eventDescriptionInput.value;

            const existingEventIndex = events.findIndex(event => event.id === id);

            if (existingEventIndex > -1) {
                // Edit existing event
                events[existingEventIndex] = { id, title, date, description };
            } else {
                // Add new event
                events.push({ id, title, date, description });
            }

            saveUserEvents();
            displayEvents();
            closeEventModal();
            eventForm.reset();
        });

        function deleteEvent(id) {
            if (confirm('Are you sure you want to delete this event?')) {
                events = events.filter(event => event.id !== id);
                saveUserEvents();
                displayEvents();
            }
        }

        // --- Search and Sort ---
        function filterEvents() {
            displayEvents(); // Re-renders with current filter
        }

        function sortAndDisplayEvents() {
            displayEvents(); // Re-renders with current sort
        }

        // --- Reminder Functionality ---
        let currentReminderEventId = null;

        function openReminderModal(eventId) {
            currentReminderEventId = eventId;
            const event = events.find(e => e.id === eventId);
            if (event) {
                reminderEventTitle.textContent = event.title;
                // Set default date/time to event date or current time + 1 hour
                const now = new Date();
                const eventDateTime = new Date(`${event.date}T09:00`); // Default to 9 AM on event date
                const defaultDateTime = eventDateTime > now ? eventDateTime : new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

                reminderDateTimeInput.value = defaultDateTime.toISOString().slice(0, 16);
                reminderModal.style.display = 'flex';
            }
        }

        function closeReminderModal() {
            reminderModal.style.display = 'none';
            currentReminderEventId = null;
            reminderForm.reset();
        }

        reminderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const reminderTime = new Date(reminderDateTimeInput.value).getTime();
            const now = Date.now();

            if (reminderTime <= now) {
                alert('Please select a future date and time for the reminder.');
                return;
            }

            const event = events.find(e => e.id === currentReminderEventId);
            if (event) {
                const timeUntilReminder = reminderTime - now;
                alert(`Reminder set for "${event.title}" on ${new Date(reminderTime).toLocaleString()}!`);

                setTimeout(() => {
                    alert(`🔔 Reminder: Your event "${event.title}" is happening now! \nDetails: ${event.description || 'No description.'}`);
                }, timeUntilReminder);
            }
            closeReminderModal();
        });

        // --- Export and Clear All ---
        function exportEvents() {
            if (events.length === 0) {
                alert('No events to export!');
                return;
            }

            const headers = ['ID', 'Title', 'Date', 'Description'];
            const rows = events.map(event => [
                event.id,
                `"${event.title.replace(/"/g, '""')}"`, // Handle quotes in title
                event.date,
                `"${event.description.replace(/"/g, '""')}"` // Handle quotes in description
            ]);

            let csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(',') + "\n"
                + rows.map(e => e.join(',')).join('\n');

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'my_events.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('Events exported successfully as my_events.csv!');
        }

        function confirmClearAllEvents() {
            if (confirm('Are you sure you want to clear ALL your events? This action cannot be undone.')) {
                events = [];
                saveUserEvents();
                displayEvents();
                alert('All events cleared!');
            }
        }
    