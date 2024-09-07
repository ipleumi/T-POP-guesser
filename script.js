let guessesLeft = 10; // Initialize the number of guesses
let data = []; // Initialize the data variable
let selectedNames = []; // Initialize the list of selected names
let answer = ''; // Initialize the answer variable

// Function to randomize the name from data
function randomizeName() {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomName = data[randomIndex].name;
    answer = randomName;
    return randomName;
}

// Function to update the number of guesses left
function updateGuessesLeft() {
    document.getElementById('try').textContent = guessesLeft;
}

// Fetch JSON file and store in local storage
fetch('db.json')
    .then(response => response.json())
    .then(fetchedData => {
        data = fetchedData; // Store fetched data in the data variable
        answer = randomizeName(); // Randomize the name after data is fetched
        showTutorial(); // Show the tutorial after data is fetched
        // Initialize the number of guesses left on page load
        document.addEventListener('DOMContentLoaded', () => {
            updateGuessesLeft();
            displayDataInTable();
            document.querySelector('.close').addEventListener('click', closeTutorial); // Move this line inside DOMContentLoaded
        });
    });

// Function to display data in table
function displayDataInTable() {
    const tableBody = document.querySelector('table tbody');
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.group}</td>
            <td>${item.role}</td>
            <td>${item.company}</td>
            <td>${item.album}</td>
            <td>${item.debutyear}</td>
            <td>${item.gender}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to search for names
function searchName() {
    const searchInput = document.querySelector('.answer-input').value.trim().toLowerCase();
    const searchResults = document.querySelector('.search-results');
    searchResults.innerHTML = '';

    if (searchInput) {
        const matches = data.filter(item => 
            item.name.toLowerCase().includes(searchInput) && !selectedNames.includes(item.name)
        );
        matches.forEach(match => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${match.name}</strong> - ${match.group}`;
            div.classList.add('search-result-item');
            div.onclick = () => {
                document.querySelector('.answer-input').value = match.name;
                searchResults.innerHTML = '';
            };
            searchResults.appendChild(div);
        });
    }
}

// Function to submit the answer and display the details in the table
function submitAnswer() {
    const answerInput = document.querySelector('.answer-input').value.trim().toLowerCase();
    const tableBody = document.querySelector('table tbody');
    const foundItem = data.find(item => item.name.toLowerCase() === answerInput);

    if (foundItem) {
        // Create a new row with the found item's details
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${foundItem.name}</td>
            <td>${foundItem.group}</td>
            <td>${foundItem.role}</td>
            <td>${foundItem.company}</td>
            <td>${foundItem.album}</td>
            <td>${foundItem.debutyear}</td>
            <td>${foundItem.gender}</td>
        `;

        // Append the new row at the end of the table body
        tableBody.appendChild(row);

        // Add the selected name to the list of selected names
        selectedNames.push(foundItem.name);
    }

    // Clear the search input box and search results
    document.querySelector('.answer-input').value = '';
    document.querySelector('.search-results').innerHTML = '';

    // Decrease the number of guesses left and update the display
    guessesLeft--;
    updateGuessesLeft();
    checkAnswer(answerInput);
    isGameOver();
}

// Function to check if the game is over
function isGameOver() {
    if (guessesLeft === 0) {
        if (document.querySelector('.result').textContent === 'Correct!') {
            showPopup('win');
        } else {
            showPopup('lose');
        }
        resetGame();
    }
}

// Function to show a popup with the result
function showPopup(result) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    const timeTaken = 10 - guessesLeft; // Calculate the number of guesses taken

    if (result === 'win') {
        popup.innerHTML = `
            <h2>Congratulations!</h2>
            <p>You guessed the correct answer: ${answer}</p>
            <p>You use ${timeTaken} guesses.</p>
            <button onclick="closePopup()">Close</button>
        `;
    } else {
        popup.innerHTML = `
            <h2>Game Over!</h2>
            <p>The correct answer was: ${answer}</p>
            <p>You used all your guesses.</p>
            <button onclick="closePopup()">Close</button>
        `;
    }

    document.body.appendChild(popup);
}

// Function to close the popup
function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
    }
}

//create function to  check if the guessed name is correct
function checkAnswer(guessedName) {
    const guessedItem = data.find(item => item.name.toLowerCase() === guessedName.toLowerCase());
    const answerItem = data.find(item => item.name.toLowerCase() === answer.toLowerCase());

    if (guessedItem && guessedItem.name.toLowerCase() === answer.toLowerCase()) {
        document.querySelector('.result').textContent = 'Correct!';
        showPopup('win');
    } else {
        document.querySelector('.result').textContent = 'Incorrect! Try again.';
        
        updateGuessesLeft();
        isGameOver();
    }

    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
    const nameCell = row.querySelector('td:first-child');
    const groupCell = row.querySelector('td:nth-child(2)');
    const roleCell = row.querySelector('td:nth-child(3)');
    const companyCell = row.querySelector('td:nth-child(4)');
    const albumCell = row.querySelector('td:nth-child(5)');
    const debutYearCell = row.querySelector('td:nth-child(6)');
    const genderCell = row.querySelector('td:nth-child(7)');

    if (nameCell && nameCell.textContent.toLowerCase() === guessedName.toLowerCase()) {
        if (guessedItem.name.toLowerCase() === answerItem.name.toLowerCase()) {
            nameCell.style.backgroundColor = '#1ff800'; // Change only the name cell's background color
        } else {
            nameCell.style.backgroundColor = ''; // Reset the name cell's background color
        }

        if (guessedItem.group.toLowerCase() === answerItem.group.toLowerCase()) {
            groupCell.style.backgroundColor = '#1ff800'; // Change only the group cell's background color
        } else {
            groupCell.style.backgroundColor = ''; // Reset the group cell's background color
        }

        if (guessedItem.company.toLowerCase() === answerItem.company.toLowerCase()) {
            companyCell.style.backgroundColor = '#1ff800'; // Change only the company cell's background color
        } else {
            companyCell.style.backgroundColor = ''; // Reset the company cell's background color
        }

        if (guessedItem.gender.toLowerCase() === answerItem.gender.toLowerCase()) {
            genderCell.style.backgroundColor = '#1ff800'; // Change only the gender cell's background color
        } else {
            genderCell.style.backgroundColor = ''; // Reset the gender cell's background color
        }

        const guessedAlbumCount = parseInt(guessedItem.album);
        const answerAlbumCount = parseInt(answerItem.album);

        if (guessedAlbumCount === answerAlbumCount) {
            albumCell.style.backgroundColor = '#1ff800'; // Change only the album cell's background color to green if correct
        } else if (Math.abs(guessedAlbumCount - answerAlbumCount) <= 2) {
            albumCell.style.backgroundColor = 'yellow'; // Change only the album cell's background color to yellow if within range
        } else {
            albumCell.style.backgroundColor = ''; // Reset the album cell's background color
        }

        const guessedDebutYear = parseInt(guessedItem.debutyear);
        const answerDebutYear = parseInt(answerItem.debutyear);

        if (guessedDebutYear === answerDebutYear) {
            debutYearCell.style.backgroundColor = '#1ff800'; // Change only the debut year cell's background color to green if correct
        } else if (Math.abs(guessedDebutYear - answerDebutYear) <= 2) {
            debutYearCell.style.backgroundColor = 'yellow'; // Change only the debut year cell's background color to yellow if within range
        } else {
            debutYearCell.style.backgroundColor = ''; // Reset the debut year cell's background color
        }

        // Check if the guessed role is correct
        //check the role cell has part of the answer role
        if (guessedItem.role.toLowerCase() === answerItem.role.toLowerCase()){
            roleCell.style.backgroundColor = '#1ff800'; // Change only the role cell's background color
        }    
        //check the role cell has the same role as the answer role
        else if(guessedItem.role.toLowerCase().includes(answerItem.role.toLowerCase())){
            roleCell.style.backgroundColor = 'yellow'; // Change only the role cell's background color
        }
        else if(answerItem.role.toLowerCase().includes(guessedItem.role.toLowerCase())){
            roleCell.style.backgroundColor = 'yellow'; // Change only the role cell's background color
        }
        else {
            roleCell.style.backgroundColor = ''; // Reset the role cell's background color
        }  
    }
});

}

// Function to reset the game
function resetGame() {
    document.querySelector('.answer-input').value = '';
    document.querySelector('.answer-message').textContent = '';
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Group</th>
            <th>Role</th>
            <th>Company</th>
            <th>Album</th>
            <th>Debut Year</th>
            <th>GENDER</th>
        </tr>
    `;

    // Reset the number of guesses left and update the display
    guessesLeft = 10;
    updateGuessesLeft();

    // Clear the list of selected names
    selectedNames = [];

    // Randomize the name and display
    answer = randomizeName();

    // clear the result message
    document.querySelector('.result').textContent = '';
}

// Show tutorial
function showTutorial() {
    document.getElementById('tutorialModal').style.display = 'block';
    document.querySelector('.close').addEventListener('click', closeTutorial); // Add this line to ensure the event listener is added
}

// Close tutorial
function closeTutorial() {
    document.getElementById('tutorialModal').style.display = 'none';
}
