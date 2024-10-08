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
            infoContent.innerHTML = generateInfoContent();
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
            item.group.toLowerCase().includes(searchInput) | item.name.toLowerCase().includes(searchInput) && !selectedNames.includes(item.name)
        );
        matches.forEach(match => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${match.name}</strong> - ${match.group}`;
            div.classList.add('search-result-item');
            div.onclick = () => {
                document.querySelector('.answer-input').value = match.name;
                searchResults.innerHTML = '';
                validateInput(); // Call validateInput to enable/disable the Guess button
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
        document.querySelector('.resultContent').textContent ="I guessed the correct answer : "+answer+"\nin "+timeTaken+" Times. \n\n#TpopGuesser \n";
        popup.innerHTML = `
            <h2>Congratulations!</h2>
            <p>You guessed the correct answer : ${answer}</p>
            <p>You use ${timeTaken} guesses.</p>
            <button onclick="closePopup()">Close</button>
            <button class="icon" onclick="shareResultTwitter()"><img src="src/x.png" width="22" height="22"></button>        
        `;
    } else {
        popup.innerHTML = `
            <h2>Game Over!</h2>
            <p>The correct answer was : ${answer}</p>
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

function shareResultTwitter() {
    const resultMessage = document.querySelector('.resultContent').textContent;
    const shareText = encodeURIComponent(resultMessage);
    const shareUrl = encodeURIComponent(window.location.href);

    // Share on Twitter
    const twitterUrl = `http://twitter.com/share?text=${shareText}&url=${shareUrl}`;
    window.open(twitterUrl, '_blank');
}

//create function to  check if the guessed name is correct
function checkAnswer(guessedName) {
    const guessedItem = data.find(item => item.name.toLowerCase() === guessedName.toLowerCase());
    const answerItem = data.find(item => item.name.toLowerCase() === answer.toLowerCase());

    if (guessedItem && guessedItem.name.toLowerCase() === answer.toLowerCase()) {
        document.querySelector('.result').textContent = 'Correct!';
        showPopup('win');
        resetGame();
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
            nameCell.style.color = 'black';
            nameCell.style.backgroundColor = '#3aca85'; // Change only the name cell's background color
        } else {
            nameCell.style.backgroundColor = ''; // Reset the name cell's background color
        }

        if (guessedItem.group.toLowerCase() === answerItem.group.toLowerCase()) {
            groupCell.style.color = 'black';
            groupCell.style.backgroundColor = '#3aca85'; // Change only the group cell's background color
        }else if(guessedItem.group.toLowerCase().includes(answerItem.group.toLowerCase())){
             groupCell.style.color = 'black';
            groupCell.style.backgroundColor = '#f1f446'; // Change only the group cell's background color
        }
        else if(answerItem.group.toLowerCase().includes(guessedItem.group.toLowerCase())){
             groupCell.style.color = 'black';
            groupCell.style.backgroundColor = '#f1f446'; // Change only the group cell's background color
        }
        else if(guessedItem.group.toLowerCase().includes(answerItem.group.toLowerCase().split(",")[0])){
             groupCell.style.color = 'black';
            groupCell.style.backgroundColor = '#f1f446'; // Change only the group cell's background color
        }
        else if(guessedItem.group.toLowerCase().includes(answerItem.group.toLowerCase().split(",")[1])){
             groupCell.style.color = 'black';
            groupCell.style.backgroundColor = '#f1f446'; // Change only the group cell's background color
        }
        else if(answerItem.group.toLowerCase().includes(guessedItem.group.toLowerCase().split(",")[0])){
             groupCell.style.color = 'black';
            groupCell.style.backgroundColor = '#f1f446'; // Change only the group cell's background color
        }
        else if(answerItem.group.toLowerCase().includes(guessedItem.group.toLowerCase().split(",")[1])){
             groupCell.style.color = 'black';
            groupCell.style.backgroundColor = '#f1f446'; // Change only the group cell's background color
        } 
        else {
            groupCell.style.backgroundColor = ''; // Reset the group cell's background color
        }

        if (guessedItem.company.toLowerCase() === answerItem.company.toLowerCase()) {
            companyCell.style.color = 'black';
            companyCell.style.backgroundColor = '#3aca85'; // Change only the company cell's background color
        } else {
            companyCell.style.backgroundColor = ''; // Reset the company cell's background color
        }

        if (guessedItem.gender.toLowerCase() === answerItem.gender.toLowerCase()) {
            genderCell.style.color = 'black';
            genderCell.style.backgroundColor = '#3aca85'; // Change only the gender cell's background color
        } else {
            genderCell.style.backgroundColor = ''; // Reset the gender cell's background color
        }

        const guessedAlbumCount = parseInt(guessedItem.album);
        const answerAlbumCount = parseInt(answerItem.album);

        if (guessedAlbumCount === answerAlbumCount) {
            albumCell.style.color = 'black';
            albumCell.style.backgroundColor = '#3aca85'; // Change only the album cell's background color to green if correct
        } else if (Math.abs(guessedAlbumCount - answerAlbumCount) <= 2) {
            albumCell.style.backgroundColor = '#f1f446'; // Change only the album cell's background color to #f1f446 if within range
            albumCell.style.color = 'black';
        } else {
            albumCell.style.backgroundColor = ''; // Reset the album cell's background color
        }

        const guessedDebutYear = parseInt(guessedItem.debutyear);
        const answerDebutYear = parseInt(answerItem.debutyear);

        if (guessedDebutYear === answerDebutYear) {
            debutYearCell.style.color = 'black';
            debutYearCell.style.backgroundColor = '#3aca85'; // Change only the debut year cell's background color to green if correct
        } else if (Math.abs(guessedDebutYear - answerDebutYear) <= 2) {
            
            debutYearCell.style.color = 'black';
            debutYearCell.style.backgroundColor = '#f1f446'; // Change only the debut year cell's background color to #f1f446 if within range
        } else {
            debutYearCell.style.backgroundColor = ''; // Reset the debut year cell's background color
        }

        // Check if the guessed role is correct
        
        if (guessedItem.role.toLowerCase() === answerItem.role.toLowerCase()){
            roleCell.style.color = 'black';
            roleCell.style.backgroundColor = '#3aca85'; // Change only the role cell's background color
        }    
        else if(guessedItem.role.toLowerCase().includes(answerItem.role.toLowerCase())){
            roleCell.style.backgroundColor = '#f1f446'; // Change only the role cell's background color
            roleCell.style.color = 'black';
        }
        else if(answerItem.role.toLowerCase().includes(guessedItem.role.toLowerCase())){
            roleCell.style.color = 'black';
            roleCell.style.backgroundColor = '#f1f446'; // Change only the role cell's background color
        }
        else if(guessedItem.role.toLowerCase().includes(answerItem.role.toLowerCase().split(",")[0])){
            roleCell.style.color = 'black';
            roleCell.style.backgroundColor = '#f1f446'; // Change only the role cell's background color
        }
        else if(guessedItem.role.toLowerCase().includes(answerItem.role.toLowerCase().split(",")[1])){
            roleCell.style.color = 'black';
            roleCell.style.backgroundColor = '#f1f446'; // Change only the role cell's background color
        }
        else if(answerItem.role.toLowerCase().includes(guessedItem.role.toLowerCase().split(",")[0])){
            roleCell.style.color = 'black';
            roleCell.style.backgroundColor = '#f1f446'; // Change only the role cell's background color
        }
        else if(answerItem.role.toLowerCase().includes(guessedItem.role.toLowerCase().split(",")[1])){
            roleCell.style.color = 'black';
            roleCell.style.backgroundColor = '#f1f446'; // Change only the role cell's background color
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
            <th>NAME</th>
            <th>GROUP<button id="infoButton" onclick="openInfoModal()" class="info-button"style="float: right;">i</button></th>
            <th>ROLE</th>
            <th>COMPANY</th>
            <th>ALBUM</th>
            <th>DEBUT YEAR</th>
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
    infoContent.innerHTML = generateInfoContent();
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

// Close info modal
function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

// Open info modal
function openInfoModal() {
    document.getElementById('infoModal').style.display = 'block';
}

// Function to validate the input
function validateInput() {
    const answerInput = document.querySelector('.answer-input').value.trim().toLowerCase();
    const guessButton = document.querySelector('.submit-answer');
    const isValid = answerInput && data.some(item => item.name.toLowerCase() === answerInput);
    guessButton.disabled = !isValid; // Disable button if input is invalid or empty
}

// Function to toggle dark theme
function toggleDarkTheme() {
    document.body.classList.toggle('dark-theme');
}

document.addEventListener('DOMContentLoaded', () => {
    const infoButton = document.getElementById('infoButton');
    const infoModal = document.getElementById('infoModal');
    const closeModal = document.querySelector('.modal .close');
    const infoContent = document.getElementById('infoContent');
    const answerInput = document.querySelector('.answer-input');

    infoButton.addEventListener('click', () => {
        // Populate the modal with all information
        infoContent.innerHTML = generateInfoContent();
        infoModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        infoModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });

    // Add input event listener to validate input
    answerInput.addEventListener('input', validateInput);

    // Initial validation
    validateInput();
});

    function generateInfoContent() {
        let content = `genelab: <br>
            Threemandown , TillyBirds , TaitosmitH , Only Monday<br>
            <br>
            LIT Entertainment: <br>
            PiXXiE , bamm <br>
            <br>
            XOXO Entertainment: <br>
            4EVE , ATLAS<br>
            <br>
            Independent Records: <br>
            Qrra<br>
            <br>
            Wayfer Records: <br>
            Jeff Satur , LUSS<br>
            <br>
            Sonray Music: <br>
            BUS5 , BUS7<br>
            <br>
            Rising Entertainment: <br>
            Empress <br>
            <br>
            LOVEiS Entertainment: <br>
            NontTanont , MEAN <br>
            <br>
            What The Duck: <br>
            BOWKYLION , Mirrr , THE TOYS , LANDOKMAI <br>
            <br>
        `;
        return content;

    }