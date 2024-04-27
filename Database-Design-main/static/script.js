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
                    <td>$${item.price.toFixed(2)}</td>
                    <td><button onclick="openReviewSection(${item.id});">Review</button></td>
                </tr>
            `;
            resultsBody.innerHTML += row;
        });
        document.getElementById('searchResults').style.display = 'block'; // Show results
        document.getElementById('reviewSection').style.display = 'none'; // Hide the review section initially
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
        alert('Failed to fetch search results.');
    });
}

function openReviewSection(itemId) {
    document.getElementById('reviewItemId').value = itemId;
    document.getElementById('reviewSection').style.display = 'block'; // Show the review section
}

function submitReview(event) {
    event.preventDefault(); // Prevent form from submitting normally
    const itemId = document.getElementById('reviewItemId').value;
    const reviewText = document.getElementById('reviewText').value;

    fetch('/add_review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId, description: reviewText })
    })
    .then(response => response.json())
    .then(result => {
        alert('Review submitted successfully!');
        document.getElementById('reviewSection').style.display = 'none'; // Optionally hide the review section
        document.getElementById('reviewForm').reset(); // Reset the form
    })
    .catch(error => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review.');
    });
}

function clearSearch() {
    document.getElementById('searchCategory').value = ''; // Clear input field
    document.getElementById('searchResultsBody').innerHTML = ''; // Clear results
    document.getElementById('searchResults').style.display = 'none'; // Hide results section
    document.getElementById('reviewSection').style.display = 'none'; // Hide the review section
}

function logoutFunction() {
    window.location.href = '/logout';
}
