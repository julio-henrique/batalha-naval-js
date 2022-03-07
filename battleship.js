// There are 3 main objects that will be doing all the work. 1 View, 2 Model and 3 Controller.

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    /* ships: [
        { locations: ["06", "16", "26"], hits: [" ", " ", " "] },
        { locations: ["24", "34", "44"], hits: [" ", " ", " "] },
        { locations: ["10", "11", "12"], hits: [" ", " ", " "] }
    ],
    */

    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],

    fire: function(guess) {
        for(let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)

            if (index >= 0) {
                ship.hits[index] = "hit"
                view.displayHit(guess)
                view.displayMessage("GREAT! You've hitted it with passion.")
                if (this.isSunk(ship)) {
                    view.displayMessage("AMAZING! The battleship will never forget this shot!")
                    this.shipsSunk++
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage("You missed. Recover for now... Then, show who's the BOSS!")
        return false
    },

    isSunk: function(ship) {        
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }
        }
        return true
    },

    generateShipLocations: function() {
        let locations
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip() 
            } while (this.collision(locations))
            this.ships[i].locations = locations
        }
        console.log("ships array: ")
        console.log(this.ships)
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2)
        let row, col

        if (direction === 1) { // Horizontal
            row = Math.floor(Math.random() * this.boardSize)
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
            col = Math.floor(Math.random() * this.boardSize)
        }
            
        let newShipLocations = []
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i))
            } else {
                newShipLocations.push((row + i) + "" + col)
            }
        }
        return newShipLocations
    },

    collision: function(locations) {
        for(let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            for(let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false
    }
}

const view = {
    // This method takes a string message and display it in the message display area.
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea")
        messageArea.innerHTML = msg
    },
    
    // This method adds HIT to the grid if the user guess was right
    displayHit: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "hit")
    }, 

    // This method adds MISS to the grid if the user guess was wrong
    displayMiss: function(location) {
        let cell = document.getElementById(location)
        cell.setAttribute("class", "miss")
    },
}

const controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess)
        if (location) {
            this.guesses++
            let hit = model.fire(location)
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`NOOOO! You sank all my battleships, in ${this.guesses} guesses`)
            }
        }
    }
}

function parseGuess(guess) {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G"]

    if (guess === null || guess.length !== 2) {
        alert(`Enter with a letter from A to G followed by a number from 0 to ${model.boardSize - 1}.`)
    } else {
        firstChar = guess.charAt(0)

		let row = alphabet.indexOf(firstChar)
        let column = guess.charAt(1)

        if (isNaN(row) || isNaN(column)) {
            alert(`Enter with a letter from A to G, followed by a number from 0 to ${model.boardSize - 1}.`)
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert(`Enter with a letter from A to G, followed by a number from 0 to ${model.boardSize - 1}.`)
        } else {
            return row + column
        }
    }
    return null
}


// Event Handlers
function handleFireButton() {
	let guessInput = document.getElementById("guessInput")
	let guess = guessInput.value.toUpperCase()

	controller.processGuess(guess)

	guessInput.value = ""
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
    fireButton.click()
        return false
    }
}

window.onload = init

function init() {
	// Fire! button onclick handler
	let fireButton = document.getElementById("fireButton")
	fireButton.onclick = handleFireButton

    let guessInput = document.getElementById("guessInput")
    guessInput.onkeypress = handleKeyPress

    model.generateShipLocations()
}