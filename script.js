// Show tutorial
function showTutorial() {
    document.getElementById('tutorialModal').style.display = 'block';
}

// Close tutorial
function closeTutorial() {
    document.getElementById('tutorialModal').style.display = 'none';
}

let guessesLeft = 10; // Initialize the number of guesses
let data = []; // Initialize the data variable
let selectedNames = []; // Initialize the list of selected names

// Function to update the number of guesses left
function updateGuessesLeft() {
    document.getElementById('try').textContent = guessesLeft;
}

// Fetch JSON file and store in local storage
fetch('db.json')
    .then(response => response.json())
    .then(fetchedData => {
        data = fetchedData; // Store fetched data in the data variable
        localStorage.setItem('data', JSON.stringify(data));
        // Initialize the number of guesses left on page load
        document.addEventListener('DOMContentLoaded', () => {
            updateGuessesLeft();
            displayDataInTable();
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
        </tr>
    `;

    // Reset the number of guesses left and update the display
    guessesLeft = 10;
    updateGuessesLeft();

    // Clear the list of selected names
    selectedNames = [];
}

// Initialize the number of guesses left on page load
document.addEventListener('DOMContentLoaded', () => {
    updateGuessesLeft();
    displayDataInTable();
});