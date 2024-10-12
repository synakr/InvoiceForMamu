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
    const rowCount = table.rows.length;
    newRow.innerHTML = `
        <td class="serial-no">${rowCount}</td>
          <td><input type="text" placeholder="Product Name" class="common"></td>
          <td><input type="text" class="common"></td>
          <td><input type="date" class="common"></td>
          <td><input type="number" value="1" class="quantity common"></td>
          <td><input type="text" class="common"></td>
          <td><input type="text" class="common"></td>
          <td><input type="number" value="1" class="rate common"></td>
          <td><input type="number" readonly class="amount common"></td>
          <td><input type="number" value="18" class="gst common"></td>
          <td><input type="number" readonly class="sgst common"></td>
          <td><input type="number" readonly class="cgst common"></td>
          <td><input type="number" readonly class="total common"></td>
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

document.getElementById('generatePDF').addEventListener('click', function() {
    window.print();
});
