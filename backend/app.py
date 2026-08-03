from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Default sample data to prevent empty/broken state in serverless execution
orders = [
    {
        "order_id": 1,
        "customer_name": "John Doe",
        "phone": "9876543210",
        "items": [{"type": "Shirt", "qty": 2, "price": 50}],
        "total": 100,
        "status": "RECEIVED"
    }
]
order_id_counter = 2

PRICE_LIST = {
    "Shirt": 50,
    "Pants": 80,
    "Saree": 100
}

# Root Endpoint (Fixes 404 on home URL)
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "success",
        "message": "Laundry System Backend API is running successfully!",
        "endpoints": {
            "GET /": "API Information",
            "GET /orders": "Retrieve orders (query params: status, phone)",
            "POST /orders": "Create a new order",
            "PUT /orders/<id>/status": "Update order status",
            "GET /dashboard": "Retrieve dashboard summary"
        }
    })

# Create Order
@app.route('/orders', methods=['POST'])
def create_order():
    global order_id_counter
    
    data = request.json or {}
    items = data.get('items', [])
    total = 0

    for item in items:
        price = PRICE_LIST.get(item.get('type'), 50)
        item['price'] = price
        total += price * item.get('qty', 1)

    order = {
        "order_id": order_id_counter,
        "customer_name": data.get('customer_name', 'Anonymous'),
        "phone": data.get('phone', ''),
        "items": items,
        "total": total,
        "status": "RECEIVED"
    }

    orders.append(order)
    order_id_counter += 1

    return jsonify(order), 201

# Update Status
@app.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_status(order_id):
    data = request.json or {}
    new_status = data.get('status')

    for order in orders:
        if order['order_id'] == order_id:
            order['status'] = new_status
            return jsonify(order), 200

    return jsonify({"error": "Order not found"}), 404

# Get Orders (with filters)
@app.route('/orders', methods=['GET'])
def get_orders():
    status = request.args.get('status')
    phone = request.args.get('phone')

    result = orders

    if status:
        result = [o for o in result if o['status'] == status]

    if phone:
        result = [o for o in result if phone in o['phone']]

    return jsonify(result), 200

# Dashboard
@app.route('/dashboard', methods=['GET'])
def dashboard():
    total_orders = len(orders)
    total_revenue = sum(o['total'] for o in orders)

    status_counts = {}
    for o in orders:
        status_counts[o['status']] = status_counts.get(o['status'], 0) + 1

    return jsonify({
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "status_counts": status_counts
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
