
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(items => {
        const resultsBody = document.getElementById('searchResultsBody');
        const itemSelect = document.getElementById('itemSelect');
        resultsBody.innerHTML = '';
        itemSelect.innerHTML = ''; // Clear previous options

        items.forEach(item => {
            const price = parseFloat(item.price); // Ensure price is a number
            const row = `
                <tr>
                    <td>${item.title}</td>
                    <td>${item.category}</td>
                    <td>$${price.toFixed(2)}</td>
                </tr>
            `;
            const option = `<option value="${item.id}">${item.title} - $${price.toFixed(2)}</option>`;
            resultsBody.innerHTML += row;
            itemSelect.innerHTML += option;
        });

        document.getElementById('searchResults').style.display = 'block'; // Show results
        document.getElementById('reviewSection').style.display = 'block'; // Show the review section
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
        alert('Failed to fetch search results.');
    });
}

function submitReview(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const itemId = document.getElementById('itemSelect').value;
    const rating = document.getElementById('rating').value;
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
        if (result.error) {
            alert(result.error);
        } else {
            alert('Review submitted successfully!');
            document.getElementById('reviewForm').reset();
        }
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
