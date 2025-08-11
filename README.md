
# Event Manager

Event Manager is a simple and intuitive web application designed to help users efficiently manage their events and tasks. It features user authentication and provides a clean interface to create, view, edit, and set reminders for events.

---

## Features

- **User Authentication:** Secure login and registration system.
- **Task Interface:** Add and manage events with ease.
- **Event Storage:** View a list of all your events.
- **Edit Events:** Modify event details anytime.
- **Event Reminders:** Set reminders for important events.

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python Flask  
- **Database:** (Specify your database here, e.g., SQLite, MongoDB)  
- **Other Libraries/Frameworks:** (Add if applicable)  

---

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/event-manager.git
   cd event-manager
````

2. **Set up a virtual environment and install dependencies:**

   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run the application:**

   ```bash
   flask run
   ```

4. **Access the app:**

   Open your browser and go to [http://localhost:5000](http://localhost:5000)

---

## Usage

* Register a new user account or login with existing credentials.
* Add new events using the task interface.
* Navigate to **My Events** to view, edit, or set reminders for your events.

---

## Repository Structure

```
event-manager/
│
├── app.py              # Main Flask application file
├── requirements.txt    # Python dependencies
├── README.md           # Project documentation
├── static/             # Static files (CSS, JavaScript, images)
│   ├── css/
│   ├── js/
│   └── images/
├── templates/          # HTML templates for Flask
│   ├── login.html
│   ├── register.html
│   ├── tasks.html
│   └── events.html
├── .gitignore          # Git ignore file
└── venv/               # Virtual environment folder (optional, usually gitignored)
```

---

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For any questions or suggestions, please open an issue or contact me at [bcsaiharika@gmail.com](mailto:bcsaiharika@gmail.com)

---

*Happy event managing!* 🎉

```
