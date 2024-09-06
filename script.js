// Fetch JSON file and store in local storage
fetch('db.json')
    .then(response => response.json())
    .then(data => {
        // Store data in local storage
        localStorage.setItem('data', JSON.stringify(data));
        // Display data in table
        displayDataInTable();
    });

// Get data from local storage
const data = JSON.parse(localStorage.getItem('data'));

// Function to show the tutorial modal
function showTutorial() {
    const modal = document.getElementById('tutorialModal');
    const span = document.getElementsByClassName('close')[0];

    modal.style.display = 'block';

    // Close the modal when the user clicks on <span> (x)
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Function to search for names
function searchName() {
    const searchInput = document.querySelector('.answer-input').value.trim().toLowerCase();
    const searchResults = document.querySelector('.search-results');
    searchResults.innerHTML = '';

    if (searchInput) {
        const matches = data.filter(item => item.name.toLowerCase().includes(searchInput));
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
            <td>${foundItem.birthday}</td>
        `;

        // Append the new row at the end of the table body
        tableBody.appendChild(row);
    }
}
// Function to reset the game
function resetGame() {
    document.querySelector('.answer-input').value = '';
    document.querySelector('.answer-message').textContent = '';
    document.querySelector('table tbody').innerHTML = `
    <tr>
        <th>Name</th>
        <th>Group</th>
        <th>Role</th>
        <th>Company</th>
        <th>Album</th>
        <th>Birthday</th>
    </tr>
`;
}