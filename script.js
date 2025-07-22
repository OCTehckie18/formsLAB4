document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedBackForm');
    const commentsTextArea = document.getElementById('comments');
    const charCountSpan = document.getElementById('charCount');
    const feedbackListDiv = document.getElementById('feedbackList');
    const clearFeedbacksBtn = document.getElementById('clearFeedbacks');
    const welcomeBackMessage = document.getElementById('welcomeBackMessage');

    const LOCAL_STORAGE_KEY = 'studentFeedbacks';
    const SESSION_STORAGE_KEY = 'userVisitedForm';

    // welcome back message logic
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
        welcomeBackMessage.classList.remove('hidden');
    } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    }

    // Initialize charCountSpan on page load
    charCountSpan.textContent = commentsTextArea.value.length;

    // comment area input character count
    commentsTextArea.addEventListener('input', () => {
        const currentLength = commentsTextArea.value.length;
        charCountSpan.textContent = currentLength;
    });

    // display saved feedbacks
    function displayFeedbacks() {
        feedbackListDiv.innerHTML = '';
        const feedbacks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

        if (feedbacks.length === 0) {
            feedbackListDiv.innerHTML = '<p class="text-center text-gray-700 col-span-full">No feedbacks submitted yet. Be the first!</p>';
            return;
        }

        feedbacks.forEach((feedback) => {
            const feedbackCard = document.createElement('div');
            feedbackCard.classList.add('bg-white', 'shadow-lg', 'rounded-lg', 'p-6', 'border', 'border-gray-200', 'm-4');

            feedbackCard.innerHTML = `
                <p class="text-gray-900 text-lg font-semibold mb-2">${feedback.fullName}</p>
                <p class="text-gray-600 mb-1"><i class="fas fa-envelope mr-2"></i>${feedback.email}</p>
                <p class="text-gray-600 mb-1"><i class="fas fa-building mr-2"></i>Department: <span class="font-medium">${feedback.department}</span></p>
                <p class="text-gray-600 mb-2">Rating:<span class="font-medium">(${feedback.rating}/5)</span></p>
                <p class="text-gray-800 text-sm italic border-t pt-2 mt-2">"${feedback.comments || 'No comments provided.'}"</p>
                <p class="text-xs text-gray-400 mt-2 text-right">Submitted: ${feedback.timestamp}</p>
            `;

            feedbackListDiv.appendChild(feedbackCard);
        });
    }

    displayFeedbacks();

    // form submission
    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const feedback = {
            fullName: document.getElementById('fullNameInput').value,
            email: document.getElementById('emailInput').value,      
            department: document.getElementById('department').value,
            rating: document.querySelector('input[name="rating"]:checked') ? document.querySelector('input[name="rating"]:checked').value : 'N/A',
            comments: commentsTextArea.value,
            timestamp: new Date().toLocaleString()
        };

        const feedbacks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        feedbacks.push(feedback);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(feedbacks));

        displayFeedbacks();

        feedbackForm.reset();
        charCountSpan.textContent = '0';

        alert('Thank you for your feedback! It has been submitted.');
    });

    // clear feedback button
    clearFeedbacksBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear ALL saved feedbacks? This action cannot be undone.')) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            displayFeedbacks(); // Refresh the display after clearing
            alert('All feedbacks have been cleared.');
        }
    });
});