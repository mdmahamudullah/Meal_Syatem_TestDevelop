document.addEventListener('DOMContentLoaded', function() {
    const userMealOverviewBody = document.getElementById('user-meal-overview');

    // Dummy data
    const users = [
        { name: 'User 1', totalMeals: 30, totalCost: 750, paidAmount: 500, balance: 250 },
        { name: 'User 2', totalMeals: 25, totalCost: 625, paidAmount: 625, balance: 0 },
        { name: 'User 3', totalMeals: 40, totalCost: 1000, paidAmount: 800, balance: 200 },
    ];

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2">${user.name}</td>
            <td class="p-2">${user.totalMeals}</td>
            <td class="p-2">${user.totalCost}</td>
            <td class="p-2">${user.paidAmount}</td>
            <td class="p-2">${user.balance}</td>
        `;
        userMealOverviewBody.appendChild(row);
    });
}); 