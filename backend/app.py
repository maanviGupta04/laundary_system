from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

orders = []
order_id_counter = 1

PRICE_LIST = {
    "Shirt": 50,
    "Pants": 80,
    "Saree": 100
}

# Create Order
@app.route('/orders', methods=['POST'])
def create_order():
    global order_id_counter
    
    data = request.json
    total = 0

    for item in data['items']:
        price = PRICE_LIST.get(item['type'], 50)
        item['price'] = price
        total += price * item['qty']

    order = {
        "order_id": order_id_counter,
        "customer_name": data['customer_name'],
        "phone": data['phone'],
        "items": data['items'],
        "total": total,
        "status": "RECEIVED"
    }

    orders.append(order)
    order_id_counter += 1

    return jsonify(order)

# Update Status
@app.route('/orders/<int:order_id>/status', methods=['PUT'])
def update_status(order_id):
    data = request.json

    for order in orders:
        if order['order_id'] == order_id:
            order['status'] = data['status']
            return jsonify(order)

    return {"error": "Order not found"}, 404

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

    return jsonify(result)

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
    })

if __name__ == '__main__':
    app.run(debug=True)
