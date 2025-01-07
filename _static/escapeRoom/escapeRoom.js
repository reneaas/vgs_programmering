class EscapeRoom {
    constructor(correctCode, hint, initialCode='') {
        this.correctCode = correctCode;
        this.hint = hint || 'Solve the puzzle to proceed.';
        this.locked = true;
        this.initialCode = initialCode;
    }

    attemptUnlock(userInput) {
        if (userInput.trim() === this.correctCode) {
            this.locked = false;
            return true;
        }
        return false;
    }

    isLocked() {
        return this.locked;
    }

    getHint() {
        return this.hint;
    }

    getInitialCode() {
        return this.initialCode;
    }
}

class EscapeRoomManager {
    constructor(rooms) {
        if (!Array.isArray(rooms) || rooms.length === 0) {
            throw new Error("Please provide an array of EscapeRooms.");
        }
        this.rooms = rooms;
        this.currentIndex = 0;
    }

    getCurrentRoom() {
        return this.rooms[this.currentIndex];
    }

    attemptCurrentRoomUnlock(userInput) {
        const room = this.getCurrentRoom();
        const success = room.attemptUnlock(userInput);
        if (success) {
            if (this.currentIndex < this.rooms.length - 1) {
                this.currentIndex++;
                return { success: true, message: "Room unlocked! Proceeding to the next room..." };
            } else {
                return { success: true, message: "Congratulations! You've escaped all rooms!" };
            }
        } else {
            return { success: false, message: "Incorrect code. Try again." };
        }
    }

    isGameComplete() {
        return this.currentIndex >= this.rooms.length - 1 && !this.getCurrentRoom().isLocked();
    }
}

class EscapeRoomGame {
    constructor(containerId, roomsData) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error('Container not found');
        }

        const rooms = roomsData.map(data => new EscapeRoom(data.correctCode, data.hint, data.initialCode));
        this.manager = new EscapeRoomManager(rooms);

        this.init();
    }

    init() {
        this.generateHTML();
        this.bindEvents();
        this.updateUI();
    }

    generateHTML() {
        this.container.innerHTML = `
            <div class="escape-room-wrapper">
                <h2>Escape the Room</h2>
                <p id="${this.containerId}-hint" class="room-hint"></p>

                <!-- Editor container where code editor will be inserted -->
                <div id="${this.containerId}-editor-container" class="editor-container"></div>

                <!-- User input field for the code -->
                <input type="text" id="${this.containerId}-input" class="room-input" placeholder="Enter the code" />
                <button id="${this.containerId}-submit" class="room-submit-button">Submit</button>
                <p id="${this.containerId}-message" class="room-message"></p>
            </div>
        `;
    }

    bindEvents() {
        const submitBtn = document.getElementById(`${this.containerId}-submit`);
        submitBtn.addEventListener('click', () => {
            this.handleSubmit();
        });
    }

    updateUI() {
        const currentRoom = this.manager.getCurrentRoom();
        document.getElementById(`${this.containerId}-hint`).textContent = currentRoom.getHint();
        document.getElementById(`${this.containerId}-message`).textContent = '';
        
        const inputEl = document.getElementById(`${this.containerId}-input`);
        inputEl.value = '';
        inputEl.disabled = false;
        document.getElementById(`${this.containerId}-submit`).disabled = false;

        // Initialize or update your code editor inside the editor-container
        // For example, if using a global initializeEditor function:
        const editorContainer = document.getElementById(`${this.containerId}-editor-container`);
        editorContainer.innerHTML = ''; // Clear previous editor instance if any
        
        makeInteractiveCode(editorContainer, currentRoom.getInitialCode());
    }

    handleSubmit() {
        const inputEl = document.getElementById(`${this.containerId}-input`);
        const messageEl = document.getElementById(`${this.containerId}-message`);
        const userInput = inputEl.value;
        const result = this.manager.attemptCurrentRoomUnlock(userInput);

        messageEl.textContent = result.message;

        if (result.success) {
            if (this.manager.isGameComplete()) {
                // Game complete, disable input
                inputEl.disabled = true;
                document.getElementById(`${this.containerId}-submit`).disabled = true;
            } else {
                // Move on to the next room
                this.updateUI();
            }
        }
    }
}