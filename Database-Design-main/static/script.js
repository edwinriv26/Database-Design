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

function openReviewModal(itemId) {
    document.getElementById('reviewItemId').value = itemId; // Set the item ID in a hidden input
    document.getElementById('reviewModal').style.display = 'block';
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(items => {
        const resultsBody = document.getElementById('searchResultsBody');
        resultsBody.innerHTML = ''; // Clear previous results
        items.forEach(item => {
            const row = `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.category}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td><a href="#" onclick="openReviewModal(${item.id});">Review</a></td>
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
function submitReview(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const itemId = document.getElementById('reviewItemId').value;
    const rating = document.getElementById('rating').value; // Getting the rating from a select input
    const reviewText = document.getElementById('reviewDescription').value;

    // AJAX call to submit the review
    fetch('/add_review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId, rating: rating, description: reviewText })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(result => {
        alert('Review submitted successfully!');
        closeReviewModal(); // Close the modal on success
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
}

function logoutFunction() {
    // Implementation depends on how you handle logout, possibly redirecting to a logout route
    window.location.href = '/logout';
}

