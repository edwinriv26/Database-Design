/* // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var modal = document.getElementById('signupModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
 */
 
 // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    var signupModal = document.getElementById('signupModal');
    var reviewModal = document.getElementById('reviewModal');
    var reviewSuccessModal = document.getElementById('reviewSuccessModal');

    if (event.target == signupModal) {
        signupModal.style.display = "none";
    }

    if (event.target == reviewModal) {
        reviewModal.style.display = "none";
    }

    if (event.target == reviewSuccessModal) {
        reviewSuccessModal.style.display = "none";
    }
}

function openSignupModal() {
    var signupModal = document.getElementById('signupModal');
    signupModal.style.display = 'block';
}

function closeSignupModal() {
    var signupModal = document.getElementById('signupModal');
    signupModal.style.display = 'none';
}


//-----------------------------------------search.html functions------------------------------------------
    
       

function performSearch() {
    const category = document.getElementById('searchCategory').value;
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category })
    })
    .then(response => response.json())
    .then(items => {
        const resultsBody = document.getElementById('searchResultsBody');
        resultsBody.innerHTML = ''; // Clear previous results
        items.forEach(item => {
            const row = `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.category}</td>
                    <td>${item.price}</td>
                </tr>
            `;
            resultsBody.innerHTML += row;
        });
        document.getElementById('searchResults').style.display = 'block'; // Show results
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
        alert('Failed to fetch search results.');
    });
}

function clearSearch() {
    document.getElementById('searchCategory').value = ''; // Clear input field
    document.getElementById('searchResultsBody').innerHTML = ''; // Clear results
    document.getElementById('searchResults').style.display = 'none'; // Hide results section
}

function logoutFunction() {
    // Implementation depends on how you handle logout, possibly redirecting to a logout route
    window.location.href = '/logout';
}

