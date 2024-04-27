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
                    <td>
                        <form onsubmit="submitReview(event, ${item.id});">
                            <select name="rating" required>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                            </select>
                            <input type="text" name="description" placeholder="Enter your review" required>
                            <button type="submit">Submit</button>
                        </form>
                    </td>
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

function submitReview(event, itemId) {
    event.preventDefault(); // Prevent the form from submitting normally
    const form = event.target;
    const rating = form.rating.value;
    const description = form.description.value;

    // AJAX call to submit the review
    fetch('/add_review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id: itemId, rating: rating, description: description })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(result => {
        alert('Review submitted successfully!');
        form.reset(); // Optionally reset the form after submission
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
    window.location.href = '/logout';
}

