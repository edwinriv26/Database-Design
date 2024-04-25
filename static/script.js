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

function logoutFunction() {
    // Redirect to the homepage or index page
    window.location.href = 'index.html';
}
