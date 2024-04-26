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

function openReviewModal() {
    var reviewModal = document.getElementById('reviewModal');
    reviewModal.style.display = 'block';
}

function closeReviewModal() {
    var reviewModal = document.getElementById('reviewModal');
    reviewModal.style.display = 'none';
}

function openReviewSuccessModal() {
    var reviewSuccessModal = document.getElementById('reviewSuccessModal');
    reviewSuccessModal.style.display = 'block';
}

function closeReviewSuccessModal() {
    var reviewSuccessModal = document.getElementById('reviewSuccessModal');
    reviewSuccessModal.style.display = 'none';
}


//-----------------------------------------search.html functions------------------------------------------
        function openReviewModal() {
            document.getElementById('reviewModal').style.display = 'block';
        }

        function closeReviewModal() {
            document.getElementById('reviewModal').style.display = 'none';
        }

        function submitReview() {
            console.log("Review submitted");
            closeReviewModal();
            document.getElementById('reviewSuccessModal').style.display = 'block';
        }

        function closeReviewSuccessModal() {
            document.getElementById('reviewSuccessModal').style.display = 'none';
        }

        function performSearch() {
            document.getElementById('searchResults').style.display = 'table';
        }

        function clearSearch() {
            document.getElementById('searchCategory').value = '';
            document.getElementById('searchResults').style.display = 'none';
        }
        
        function performSearch() {
            // Get the value of the search category input
            var searchCategory = document.getElementById('searchCategory').value;
    
            // You can perform further actions here, such as sending the search query to the server
            // and retrieving search results dynamically. For now, let's just log the search query.
            console.log("Search query:" +  searchQuery);

            // Show the search results table
            document.getElementById('searchResults').style.display = 'table';

            // Prevent the default form submission behavior
            return false;
        }

//------------------------------------------for all html files-----------------------------------------------
        function logoutFunction() {
            // Redirect to the homepage or index page
            window.location.href = '/logout';
        }
