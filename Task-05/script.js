// Seed services
const services = [
    { id: 'dry', name: 'Dry Cleaning', price: 200 },
    { id: 'wash', name: 'Wash & Fold', price: 100 },
    { id: 'iron', name: 'Ironing', price: 30 },
    { id: 'stain', name: 'Stain Removal', price: 500 },
    { id: 'leather', name: 'Leather & Suede Cleaning', price: 999 },
    { id: 'wedding', name: 'Wedding Dress Cleaning', price: 2800 },
];

const cart = new Map();
const fmt = (n) => `₹ ${n.toLocaleString('en-IN')}`;

function renderServiceRow(svc) {
    const row = document.createElement('div');
    row.className = 'svc-item';

    const left = document.createElement('div');
    left.className = 'svc-left';
    left.innerHTML = `<span class="svc-name">${svc.name}</span> · <span class="svc-price">${fmt(svc.price)}.00</span>`;

    const btn = document.createElement('button');
    btn.className = 'svc-btn';
    btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';

    function updateBtn() {
        if (cart.has(svc.id)) {
            btn.classList.add('added');
            btn.innerHTML = '<i class="fa-solid fa-minus"></i> Remove item';
        } else {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
        }
    }
    updateBtn();

    btn.addEventListener('click', () => {
        if (cart.has(svc.id)) cart.delete(svc.id); else cart.set(svc.id, svc);
        updateBtn();
        renderCart();
    });

    row.append(left, btn);
    return row;
}

function renderServices() {
    const wrap = document.getElementById('svcItems');
    wrap.innerHTML = '';
    services.forEach(s => wrap.appendChild(renderServiceRow(s)));
}

function renderCart() {
    const body = document.getElementById('cartBody');
    body.innerHTML = '';
    const items = Array.from(cart.values());
    if (items.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="3" style="text-align:center;color:#94a3b8;padding:28px 12px"><i class="fa-solid fa-circle-info"></i> No Items Added</td>';
        body.appendChild(tr);
    } else {
        items.forEach((item, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i + 1}</td><td>${item.name}</td><td style="text-align:right">${fmt(item.price)}.00</td>`;
            body.appendChild(tr);
        });
    }
    const total = items.reduce((a, b) => a + b.price, 0);
    document.getElementById('total').textContent = fmt(total) + '.00';
    updateBookState();
}

function updateBookState() {
    const hasItems = cart.size > 0;
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const valid = hasItems && name && /.+@.+\..+/.test(email) && phone.replace(/\D/g, '').length >= 8;
    const btn = document.getElementById('bookBtn');
    btn.disabled = !valid;
    btn.classList.toggle('enabled', valid);
}

['fullName', 'email', 'phone'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateBookState);
});

// ✅ Removed the alert box listener (old bookBtn click)
// The booking is handled via form submit + EmailJS

renderServices();
renderCart();

// EmailJS
(function () {
    emailjs.init("h9z4_nd5t_FiH-94W");
})();

document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const orderId = Math.floor(100000 + Math.random() * 900000);

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    const orders = Array.from(cart.values()).map(service => `${service.name} — ₹${service.price}`);
    const orderList = orders.join("\n");  // convert array to string

    const subtotal = orders.reduce((t, s) => t + parseFloat(s.match(/\d+/)[0]), 0);
    const shipping = 50;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    emailjs.send("service_laundry", "template_laundry", {
        order_id: orderId,
        orders: orderList,          // plain text string
        total: total.toFixed(2),    // flat key
        user_name: name,            // matches {{user_name}}
        user_email: email,          // matches {{user_email}}
        user_phone: phone           // matches {{user_phone}}
        to_email: email
    })
    .then(() => {
        let msg = document.getElementById("bookingMsg");
        msg.style.display = "block";
        msg.textContent = `✅ Thank you ${name}, your booking (#${orderId}) is confirmed.`;
        document.getElementById("bookingForm").reset();
        cart.clear();
        renderServices();
        renderCart();
    }, (error) => {
        alert("❌ Failed to send booking. Please try again.\n" + JSON.stringify(error));
        console.error(error);
    });
});
