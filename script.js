// Function to calculate the row total
function calculateRow(row) {
    const gst = parseFloat(row.querySelector('.gst').value) || 0;
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    const rate = parseFloat(row.querySelector('.rate').value) || 0;

    const amount = quantity * rate;
    const cgst = (gst / 2 / 100) * amount;
    const sgst = (gst / 2 / 100) * amount;
    const total = amount + cgst + sgst;

    row.querySelector('.amount').value = amount.toFixed(2);
    row.querySelector('.cgst').value = cgst.toFixed(2);
    row.querySelector('.sgst').value = sgst.toFixed(2);
    row.querySelector('.total').value = total.toFixed(2);
}

// Function to update the grand total
function updateGrandTotal() {
    const rows = document.querySelectorAll('#itemsTable tbody tr');
    let grandTotal = 0;

    rows.forEach(row => {
        const total = parseFloat(row.querySelector('.total').value) || 0;
        grandTotal += total;
    });

    document.getElementById('grandTotal').value = grandTotal.toFixed(2);
}

// Add event listeners for real-time calculation
document.querySelectorAll('#itemsTable input').forEach(input => {
    input.addEventListener('input', (event) => {
        const row = event.target.closest('tr');
        calculateRow(row);
        updateGrandTotal();
    });
});

document.getElementById('addRow').addEventListener('click', function() {
    const table = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="text" placeholder="Item Name"></td>
        <td><input type="text"></td>
        <td><input type="number" value="18" class="gst"></td>
        <td><input type="number" value="1" class="quantity"></td>
        <td><input type="number" value="1" class="rate"></td>
        <td><input type="number" readonly class="amount"></td>
        <td><input type="number" readonly class="cgst"></td>
        <td><input type="number" readonly class="sgst"></td>
        <td><input type="number" readonly class="total"></td>
    `;
    // Add event listeners for new row
    newRow.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (event) => {
            const row = event.target.closest('tr');
            calculateRow(row);
            updateGrandTotal();
        });
    });
});

document.getElementById('logoUpload').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const logo = document.getElementById('logoPreview');
        logo.src = reader.result;
        logo.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById('signUpload').addEventListener('change', function(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const sign = document.getElementById('signPreview');
        sign.src = reader.result;
        sign.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
});

document.getElementById('generatePDF').addEventListener('click', function() {
    window.print();
});
