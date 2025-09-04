document.addEventListener('DOMContentLoaded', function() {
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

    // Function to calculate the totals for SGST and CGST across all rows
    function updateTaxTotals() {
        let gstTotals = {
            5: { amount: 0, sgst: 0, cgst: 0 },
            12: { amount: 0, sgst: 0, cgst: 0 },
            18: { amount: 0, sgst: 0, cgst: 0 },
            28: { amount: 0, sgst: 0, cgst: 0 }
        };

        const rows = document.querySelectorAll('#itemsTable tbody tr');

        rows.forEach(row => {
            const gst = parseFloat(row.querySelector('.gst').value) || 0;
            const amount = parseFloat(row.querySelector('.amount').value) || 0;
            const sgst = parseFloat(row.querySelector('.sgst').value) || 0;
            const cgst = parseFloat(row.querySelector('.cgst').value) || 0;

            if (gstTotals[gst] !== undefined) {
                gstTotals[gst].amount += amount;
                gstTotals[gst].sgst += sgst;
                gstTotals[gst].cgst += cgst;
            }
        });

        // Update the second table with the calculated totals
        Object.keys(gstTotals).forEach(gstClass => {
            document.querySelector(`#class${gstClass} .justTotal`).value = gstTotals[gstClass].amount.toFixed(2);
            document.querySelector(`#class${gstClass} .totalSgst`).value = gstTotals[gstClass].sgst.toFixed(2);
            document.querySelector(`#class${gstClass} .totalCgst`).value = gstTotals[gstClass].cgst.toFixed(2);
            // Update total for each GST class
            document.querySelector(`#class${gstClass} input[type="number"]:last-child`).value = (gstTotals[gstClass].sgst + gstTotals[gstClass].cgst).toFixed(2);
        });
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
        updateList2(); // Update list2 values whenever grand total is updated
    }

    // Function to update the list2 values dynamically
    function updateList2() {
        const subTotal = Array.from(document.querySelectorAll('#itemsTable tbody tr'))
            .reduce((acc, row) => acc + (parseFloat(row.querySelector('.amount').value) || 0), 0);

        const gstPayable = Array.from(document.querySelectorAll('#subtable tbody tr'))
            .reduce((acc, row) => acc + (parseFloat(row.querySelector('input[type="number"]:last-child').value) || 0), 0);

        const netTotal = document.getElementById('grandTotal').value;

        document.querySelector('.list2 li:nth-child(1)').textContent = `${subTotal.toFixed(2)}`;
        document.querySelector('.list2 li:nth-child(3)').textContent = `${gstPayable.toFixed(2)}`;
        document.querySelector('.list2 li:nth-child(5)').textContent = `${netTotal}`;
        document.querySelector('.list2 li:nth-child(7)').textContent = `${netTotal}`;
    }

    // Add event listeners for real-time calculation
    document.querySelectorAll('#itemsTable input').forEach(input => {
        input.addEventListener('input', (event) => {
            const row = event.target.closest('tr');
            calculateRow(row);
            updateGrandTotal();
            updateTaxTotals(); // Also update SGST and CGST totals
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
            <td><input type="text" class="common"></td>
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

        // Reapply flatpickr to the newly added date inputs
        flatpickr(newRow.querySelectorAll(".date-picker"), {
            dateFormat: "d-m-Y",
        });

        // Add event listeners for the new row
        newRow.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (event) => {
                const row = event.target.closest('tr');
                calculateRow(row);
                updateGrandTotal();
                updateTaxTotals(); // Also update SGST and CGST totals
            });
        });
    });

    // For date-issue
    document.getElementById('generatePDF').addEventListener('click', function() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(dateInput => {
            const dateValue = dateInput.value;
            dateInput.type = 'text'; // Temporarily change the input type to text
            dateInput.value = dateValue; // Set the text value
            dateInput.type = 'date'; // Change back to date input after printing
        });
        window.print(); // Generate the PDF
    });

    // Call the functions on page load to ensure proper initialization
    updateGrandTotal();
    updateTaxTotals();
    updateList2(); // Initialize list2 values on page load
});
