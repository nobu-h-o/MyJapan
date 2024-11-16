// assets/scripts/navigation.js
document.addEventListener('DOMContentLoaded', () => {
    const sections = Array.from(document.querySelectorAll('section'));
    let currentSectionIndex = 0;

    console.log('Navigation script loaded.');

    // Initially show the first section
    sections[currentSectionIndex].classList.add('visible');
    console.log(`Showing section: ${sections[currentSectionIndex].id}`);

    // Handle Next buttons
    const nextButtons = document.querySelectorAll('.next');
    nextButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default button behavior

            const currentSection = sections[currentSectionIndex];
            let input = null;
            let value = null;

            // Determine the type of input based on the section
            if (currentSection.id === 'Q2') { // Range input
                input = currentSection.querySelector('input[type="number"]');
                value = input ? input.value : null;
            } else if (currentSection.id === 'Q3') { // Number input
                input = currentSection.querySelector('input[type="number"]');
                value = input ? input.value : null;
            } else { // Select inputs or sections without inputs
                input = currentSection.querySelector('select');
                value = input ? input.value : null;
            }

            // Validate input only if it exists
            if (input && !value) {
                alert('Please provide an answer to proceed.');
                return;
            }

            // Log the current input for debugging
            if (input) {
                console.log(`Question ${currentSection.id}:`, value);
            } else {
                console.log(`Navigating from section: ${currentSection.id} (no input)`);
            }

            // Handle navigation or submission
            if (currentSection.id === 'Q6') {
                // Last question, submit data
                console.log('Submitting data...');
                window.submitData(); // Call the globally accessible function
            } else {
                // Navigate to next section
                sections[currentSectionIndex].classList.remove('visible');
                currentSectionIndex++;
                if (currentSectionIndex < sections.length) {
                    sections[currentSectionIndex].classList.add('visible');
                    console.log(`Navigated to section: ${sections[currentSectionIndex].id}`);
                } else {
                    console.error('No more sections to navigate to.');
                }
            }
        });
    });

    // Handle Previous buttons
    const prevButtons = document.querySelectorAll('.prev');
    prevButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default button behavior

            if (currentSectionIndex > 0) {
                sections[currentSectionIndex].classList.remove('visible');
                currentSectionIndex--;
                sections[currentSectionIndex].classList.add('visible');
                console.log(`Navigated back to section: ${sections[currentSectionIndex].id}`);
            }
        });
    });


    // Increment and Decrement age buttons (if applicable)
    const decreaseAgeButton = document.getElementById('decrease-age');
    const increaseAgeButton = document.getElementById('increase-age');
    const ageInput = document.getElementById('preference3');

    if (decreaseAgeButton && increaseAgeButton && ageInput) {
        decreaseAgeButton.addEventListener('click', () => {
            let currentValue = parseInt(ageInput.value);
            if (currentValue > parseInt(ageInput.min)) {
                ageInput.value = currentValue - 1;
                console.log('Age decreased to:', ageInput.value);
            }
        });

        increaseAgeButton.addEventListener('click', () => {
            let currentValue = parseInt(ageInput.value);
            if (currentValue < parseInt(ageInput.max || 120)) { // Assuming max age 120
                ageInput.value = currentValue + 1;
                console.log('Age increased to:', ageInput.value);
            }
            if (currentValue === 120) {
                alert("Stop lying...");
            }
        });
    }

    const decreaseDaysButton = document.getElementById('decrease-days');
    const increaseDaysButton = document.getElementById('increase-days');
    const daysInput = document.getElementById('preference2');

    if (decreaseDaysButton && increaseDaysButton && daysInput) {
        decreaseDaysButton.addEventListener('click', () => {
            let currentValue = parseInt(daysInput.value);
            if (currentValue > parseInt(daysInput.min)) {
                daysInput.value = currentValue - 1;
                console.log('Days decreased to:', daysInput.value);
            }
        });

        increaseDaysButton.addEventListener('click', () => {
            let currentValue = parseInt(daysInput.value);
            if (currentValue < parseInt(daysInput.max || 7)) { // Assuming max days 7
                daysInput.value = currentValue + 1;
                console.log('Days increased to:', daysInput.value);
            }
            if (currentValue === 7) {
                alert("Sorry, we currently only support a trip that is up to 7 days long... :(");
            }
        });
    }



    // Handle Start button
    const startButton = document.querySelector('.start');
    if (startButton) {
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Start button clicked.');
            // Hide the start section and show the first questionnaire section
            const startSection = document.querySelector('#start'); // Assuming start section has id="start"
            if (startSection) {
                startSection.classList.remove('visible');
                currentSectionIndex = 0;
                sections[currentSectionIndex].classList.add('visible');
                console.log(`Navigated to section: ${sections[currentSectionIndex].id}`);
            }

        });
    }


});