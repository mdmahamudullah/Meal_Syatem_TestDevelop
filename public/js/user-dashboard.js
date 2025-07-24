document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const calendarDiv = document.getElementById('calendar');
    const calendarHeaderDiv = document.getElementById('calendar-header');

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Populate month select
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Populate year select
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= 2050; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Set current month and year
    const now = new Date();
    monthSelect.value = now.getMonth();
    yearSelect.value = now.getFullYear();

    function generateCalendar(month, year) {
        calendarDiv.innerHTML = '';
        calendarHeaderDiv.innerHTML = '';
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add header
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        calendarHeaderDiv.innerHTML += `<div class="font-bold text-center col-span-1">Day</div>`;
        calendarHeaderDiv.innerHTML += `<div class="font-bold text-center col-span-1">Date</div>`;
        calendarHeaderDiv.innerHTML += `<div class="font-bold text-center col-span-3">Breakfast</div>`;
        calendarHeaderDiv.innerHTML += `<div class="font-bold text-center col-span-3">Lunch</div>`;
        calendarHeaderDiv.innerHTML += `<div class="font-bold text-center col-span-4">Dinner</div>`;


        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = dayNames[date.getDay()];

            const dayNameCell = document.createElement('div');
            dayNameCell.classList.add('border', 'p-2', 'text-center', 'font-bold', 'col-span-1');
            dayNameCell.textContent = dayOfWeek;
            calendarDiv.appendChild(dayNameCell);

            const dayCell = document.createElement('div');
            dayCell.classList.add('border', 'p-2', 'text-center', 'font-bold', 'col-span-1');
            dayCell.textContent = day;
            calendarDiv.appendChild(dayCell);

            const breakfastCell = document.createElement('div');
            breakfastCell.classList.add('border', 'p-2', 'col-span-3', 'flex', 'justify-center', 'items-center');
            breakfastCell.innerHTML = `<label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" class="sr-only peer" data-meal="breakfast" data-day="${day}">
              <div class="w-11 h-6 bg-red-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>`;
            calendarDiv.appendChild(breakfastCell);

            const lunchCell = document.createElement('div');
            lunchCell.classList.add('border', 'p-2', 'col-span-3', 'flex', 'justify-center', 'items-center');
            lunchCell.innerHTML = `<label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" class="sr-only peer" data-meal="lunch" data-day="${day}">
              <div class="w-11 h-6 bg-red-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>`;
            calendarDiv.appendChild(lunchCell);

            const dinnerCell = document.createElement('div');
            dinnerCell.classList.add('border', 'p-2', 'col-span-4', 'flex', 'justify-center', 'items-center');
            dinnerCell.innerHTML = `<label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" class="sr-only peer" data-meal="dinner" data-day="${day}">
              <div class="w-11 h-6 bg-red-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>`;
            calendarDiv.appendChild(dinnerCell);
        }
        fetchMeals(parseInt(monthSelect.value), parseInt(yearSelect.value));
    }

    const toggleAllMealsCheckbox = document.getElementById('toggle-all-meals');
    toggleAllMealsCheckbox.addEventListener('change', () => {
        const allMealCheckboxes = document.querySelectorAll('#calendar input[type="checkbox"]');
        allMealCheckboxes.forEach(checkbox => {
            checkbox.checked = toggleAllMealsCheckbox.checked;
        });
        updateSummary();
        
        const year = yearSelect.value;
        const month = parseInt(monthSelect.value) + 1;
        const active = toggleAllMealsCheckbox.checked;

        fetch('/api/meals/toggle-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ year, month, active })
        });
    });

    monthSelect.addEventListener('change', () => {
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
        fetchMeals(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });
    yearSelect.addEventListener('change', () => {
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
        fetchMeals(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });

    generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    updateSummary();
    fetchMeals(parseInt(monthSelect.value), parseInt(yearSelect.value));

    function fetchMeals(month, year) {
        fetch(`/api/meals?month=${month + 1}&year=${year}`)
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(day => {
                    const meals = data[day];
                    Object.keys(meals).forEach(meal => {
                        const checkbox = document.querySelector(`input[data-day="${day}"][data-meal="${meal}"]`);
                        if (checkbox) {
                            checkbox.checked = meals[meal];
                        }
                    });
                });
                updateSummary();
            });
    }

    function updateSummary() {
        const breakfastCount = document.querySelectorAll('input[data-meal="breakfast"]:checked').length;
        const lunchCount = document.querySelectorAll('input[data-meal="lunch"]:checked').length;
        const dinnerCount = document.querySelectorAll('input[data-meal="dinner"]:checked').length;

        const breakfastRate = 20;
        const lunchRate = 30;
        const dinnerRate = 25;

        const totalAmount = (breakfastCount * breakfastRate) + (lunchCount * lunchRate) + (dinnerCount * dinnerRate);
        
        // This is dummy data for now
        const paidAmount = 0; 
        const fixedExpense = 20;
        
        const grandTotal = totalAmount + fixedExpense;
        const balance = grandTotal - paidAmount;

        document.getElementById('summary-breakfast-count').textContent = breakfastCount;
        document.getElementById('summary-lunch-count').textContent = lunchCount;
        document.getElementById('summary-dinner-count').textContent = dinnerCount;
        
        document.getElementById('summary-lunch-rate').textContent = lunchRate;
        document.getElementById('summary-breakfast-rate').textContent = breakfastRate;
        document.getElementById('summary-dinner-rate').textContent = dinnerRate;

        document.getElementById('summary-total-amount').textContent = totalAmount;
        document.getElementById('summary-fixed-expense').textContent = fixedExpense;
        document.getElementById('summary-grand-total').textContent = grandTotal;
        document.getElementById('summary-paid-amount').textContent = paidAmount;
        document.getElementById('summary-balance').textContent = balance;
    }

    calendarDiv.addEventListener('change', (event) => {
        updateSummary();
        const checkbox = event.target;
        const meal = checkbox.dataset.meal;
        const day = checkbox.dataset.day;
        const month = monthSelect.value;
        const year = yearSelect.value;
        const isChecked = checkbox.checked;

        fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ year, month, day, meal, isChecked })
        });
    });
});