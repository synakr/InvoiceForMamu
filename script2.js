document.addEventListener('DOMContentLoaded', function() {
    // Function to calculate the row total
    function calculateRow(row) {
        const gst = parseFloat(row.querySelector('.gst').value) || 0;
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const discount = parseFloat(row.querySelector('.discount').value) || 0;

        const amount = quantity * rate;
        const cgst = (gst / 2 / 100) * amount;
        const sgst = (gst / 2 / 100) * amount;
        const totalBeforeDiscount = amount + cgst + sgst;
        const discountAmount = (discount / 100) * totalBeforeDiscount;
        const total = totalBeforeDiscount - discountAmount;

        row.querySelector('.amount').value = amount.toFixed(2);
        row.querySelector('.discount').value = discount.toFixed(2);
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

        Object.keys(gstTotals).forEach(gstClass => {
            document.querySelector(`#class${gstClass} .justTotal`).value = gstTotals[gstClass].amount.toFixed(2);
            document.querySelector(`#class${gstClass} .totalSgst`).value = gstTotals[gstClass].sgst.toFixed(2);
            document.querySelector(`#class${gstClass} .totalCgst`).value = gstTotals[gstClass].cgst.toFixed(2);
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
        updateList2();
        updateSummarySection();
    }

    // Function to update the list2 values dynamically
    function updateList2() {
        const rows = Array.from(document.querySelectorAll('#itemsTable tbody tr'));

        const subTotal = rows.reduce((acc, row) => acc + (parseFloat(row.querySelector('.amount').value) || 0), 0);

        const gstPayable = Array.from(document.querySelectorAll('#subtable tbody tr'))
            .reduce((acc, row) => acc + (parseFloat(row.querySelector('input[type="number"]:last-child').value) || 0), 0);

        const totalDiscount = rows.reduce((acc, row) => {
            const amount = parseFloat(row.querySelector('.amount').value) || 0;
            const cgst = parseFloat(row.querySelector('.cgst').value) || 0;
            const sgst = parseFloat(row.querySelector('.sgst').value) || 0;
            const discountRate = parseFloat(row.querySelector('.discount').value) || 0;
            const totalBeforeDiscount = amount + cgst + sgst;
            return acc + (discountRate / 100) * totalBeforeDiscount;
        }, 0);

        const netTotal = document.getElementById('grandTotal').value;

        document.querySelector('.list2 li:nth-child(1)').textContent = `${subTotal.toFixed(2)}`;
        document.querySelector('.list2 li:nth-child(2)').textContent = `${totalDiscount.toFixed(2)}`;
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
            updateTaxTotals();
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
            <td><input type="number" value="0" class="discount common"></td>
            <td><input type="number" readonly class="amount common"></td>
            <td><input type="number" value="18" class="gst common"></td>
            <td><input type="number" readonly class="sgst common"></td>
            <td><input type="number" readonly class="cgst common"></td>
            <td><input type="number" readonly class="total common"></td>
        `;

        // Add event listeners for all inputs in the new row
        newRow.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (event) => {
                const row = event.target.closest('tr');
                calculateRow(row);
                updateGrandTotal();
                updateTaxTotals();
            });
        });

        // Trigger calculation for the new row immediately
        calculateRow(newRow);
        updateGrandTotal();
        updateTaxTotals();
    });

    document.getElementById('generatePDF').addEventListener('click', function() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(dateInput => {
            const dateValue = dateInput.value;
            dateInput.type = 'text';
            dateInput.value = dateValue;
            dateInput.type = 'date';
        });
        window.print();
    });

    // Initial calculations on page load
    updateGrandTotal();
    updateTaxTotals();
    updateList2();

    // Update summary section with transaction details
    function updateSummarySection() {
    // Invoice No
    const invoiceNo = document.getElementById('invoiceNo')?.value || '';
    document.getElementById('summaryInvoiceNo').textContent = invoiceNo;
    // Invoice Date
    const invoiceDateInput = document.getElementById('invoiceDate');
    document.getElementById('summaryInvoiceDate').textContent = invoiceDateInput?.value || '';
    // Customer fields
    const customerInputs = document.querySelectorAll('.billed-to input');
    document.getElementById('summaryCustomerName').textContent = customerInputs[0]?.value || '';
    document.getElementById('summaryCustomerAddress').textContent = customerInputs[1]?.value || '';
    document.getElementById('summaryCustomerCity').textContent = customerInputs[2]?.value || '';
    document.getElementById('summaryCustomerState').textContent = customerInputs[3]?.value || '';
    document.getElementById('summaryCustomerPin').textContent = customerInputs[4]?.value || '';
    document.getElementById('summaryCustomerPhone').textContent = customerInputs[5]?.value || '';
    document.getElementById('summaryCustomerGSTIN').textContent = customerInputs[7]?.value || '';
    // Subtotal, Discount, GST Payable, Net Total, Grand Total
    document.getElementById('summarySubTotal').textContent = document.querySelector('.list2 li:nth-child(1)')?.textContent || '';
    document.getElementById('summaryDiscount').textContent = document.querySelector('.list2 li:nth-child(2)')?.textContent || '';
    document.getElementById('summaryGSTPayable').textContent = document.querySelector('.list2 li:nth-child(3)')?.textContent || '';
    document.getElementById('summaryNetTotal').textContent = document.querySelector('.list2 li:nth-child(5)')?.textContent || '';
    document.getElementById('summaryGrandTotal').textContent = document.querySelector('.list2 li:nth-child(7)')?.textContent || '';
    // Bill No, Date, Amount, O/Days
    document.getElementById('summaryBillNo').textContent = invoiceNo || '0';
    document.getElementById('summaryBillDate').textContent = invoiceDateInput?.value || '';
    document.getElementById('summaryBillAmount').textContent = document.querySelector('.list2 li:nth-child(7)')?.textContent || '0.00';
    document.getElementById('summaryBillODays').textContent = '0';
    }

    // Update summary on input changes
    document.querySelectorAll('#invoiceNo, .invoice-date input, .billed-to input[type="text"]').forEach(input => {
        input.addEventListener('input', updateSummarySection);
    });
});
