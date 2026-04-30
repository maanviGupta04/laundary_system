const BASE_URL = "http://127.0.0.1:5000";


window.onload = function () {
    addItem();
};

// Add item row
function addItem() {
    const container = document.getElementById("itemsContainer");

    const div = document.createElement("div");
    div.classList.add("item-row");

    div.innerHTML = `
        <select class="type">
            <option>Shirt</option>
            <option>Pants</option>
            <option>Saree</option>
        </select>

        <input type="number" class="qty" placeholder="Qty" min="1">

        <button onclick="this.parentElement.remove()">Remove</button>
    `;

    container.appendChild(div);
}

// Create Order
function createOrder() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const itemDivs = document.querySelectorAll(".item-row");

    let items = [];

    itemDivs.forEach(div => {
        const type = div.querySelector(".type").value;
        const qty = parseInt(div.querySelector(".qty").value) || 0;

        if (qty > 0) {
            items.push({ type, qty });
        }
    });

    if (!name || !phone) {
        alert("Please enter customer details!");
        return;
    }

    if (items.length === 0) {
        alert("Add at least one valid item!");
        return;
    }

    fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customer_name: name,
            phone: phone,
            items: items
        })
    })
    .then(res => res.json())
    .then(data => {
        showToast("Order Created! ID: " + data.order_id, "success");

        // Reset form after creation
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("itemsContainer").innerHTML = "";
        addItem();

        loadOrders();
    });
}

function showToast(message, type="success") {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Load Orders
function loadOrders() {
    fetch(`${BASE_URL}/orders`)
    .then(res => res.json())
    .then(data => {
        let table = document.getElementById("ordersTable");

        table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
        </tr>`;

        data.forEach(o => {
            table.innerHTML += `
            <tr>
                <td>${o.customer_name}</td>
                <td>${o.phone}</td>
                <td>₹${o.total}</td>
                <td><span class="status ${o.status}">${o.status}</span></td>
                <td>
                    <button onclick="viewOrderById(${o.order_id})">View</button>
                    <button onclick="updateStatus(${o.order_id}, 'PROCESSING')">Processing</button>
                    <button onclick="updateStatus(${o.order_id}, 'READY')">Ready</button>
                    <button onclick="updateStatus(${o.order_id}, 'DELIVERED')">Delivered</button>
                    <button onclick="downloadPDF(${o.order_id})"> Download Bill</button>
                </td>
            </tr>`;
        });
    });
}

// Update Status
function updateStatus(id, status) {
    fetch(`${BASE_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({status})
    }).then(() => loadOrders());
}

// View Order by ID
function viewOrderById(orderId) {
    fetch(`${BASE_URL}/orders`)
    .then(res => res.json())
    .then(data => {
        const order = data.find(o => o.order_id === orderId);
        if (order) viewOrder(order);
    });
}

// Sliding Panel
function viewOrder(order) {
    const panel = document.getElementById("orderPanel");
    const details = document.getElementById("orderDetails");

    let itemsHTML = order.items.map(item => `
        <div class="item-box">
            ${item.type} x ${item.qty} = ₹${item.qty * item.price}
        </div>
    `).join("");

    details.innerHTML = `
        <p><strong>Order ID:</strong> ${order.order_id}</p>
        <p><strong>Name:</strong> ${order.customer_name}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Status:</strong> ${order.status}</p>

        <h3>Items</h3>
        ${itemsHTML}

        <h3>Total: ₹${order.total}</h3>
    `;

    panel.classList.add("active");
}

// Close panel
function closePanel() {
    document.getElementById("orderPanel").classList.remove("active");
}

// Outside click close
window.addEventListener("click", function(event) {
    const panel = document.getElementById("orderPanel");
    const content = document.querySelector(".panel-content");

    if (panel.classList.contains("active") && !content.contains(event.target)) {
        panel.classList.remove("active");
    }
});

// Dashboard
function loadDashboard() {
    fetch(`${BASE_URL}/dashboard`)
    .then(res => res.json())
    .then(data => {

        let statusHTML = Object.entries(data.status_counts)
            .map(([key, value]) => 
                `<div class="status-card">${key}: ${value}</div>`
            ).join("");

        document.getElementById("dashboard").innerHTML = `
            <div class="dashboard-grid">
                <div class="card">
                    <h3>Total Orders</h3>
                    <p>${data.total_orders}</p>
                </div>

                <div class="card">
                    <h3>Total Revenue</h3>
                    <p>₹${data.total_revenue}</p>
                </div>

                <div class="card">
                    <h3>Status</h3>
                    <div class="status-container">
                        ${statusHTML}
                    </div>
                </div>
            </div>
        `;
    });
}
// PDF
function downloadPDF(orderId) {
    const { jsPDF } = window.jspdf;

    fetch(`${BASE_URL}/orders`)
    .then(res => res.json())
    .then(data => {
        const order = data.find(o => o.order_id === orderId);
        if (!order) return;

        const doc = new jsPDF();

        doc.text("Laundry Invoice", 20, 20);
        doc.text(`Order ID: ${order.order_id}`, 20, 40);
        doc.text(`Customer: ${order.customer_name}`, 20, 50);

        let y = 70;
        order.items.forEach(item => {
            y += 10;
            doc.text(`${item.type} x ${item.qty}`, 20, y);
        });

        y += 20;
        doc.text(`Total: ₹${order.total}`, 20, y);

        doc.save(`Invoice_${order.order_id}.pdf`);
    });
}
