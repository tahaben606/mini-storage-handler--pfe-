from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Data functions
def read_data():
    try:
        with open('data.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {"employees": [], "users": [], "equipment": [], "attributions": []}

def write_data(data):
    with open('data.json', 'w') as file:
        json.dump(data, file, indent=4)

# -----------------------
# Employee Routes
# -----------------------
@app.route('/api/employees', methods=['GET'])
def get_employees():
    data = read_data()
    return jsonify(data.get('employees', []))

@app.route('/api/employees', methods=['POST'])
def add_employee():
    new_employee = request.json
    data = read_data()
    employees = data.get("employees", [])
    
    new_employee["id_employee"] = len(employees) + 1
    employees.append(new_employee)
    
    data["employees"] = employees
    write_data(data)
    return jsonify(new_employee), 201

@app.route('/api/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    data = read_data()
    employees = data.get("employees", [])
    updated_data = request.json

    for i, emp in enumerate(employees):
        if emp["id_employee"] == id:
            employees[i] = {**emp, **updated_data, "id_employee": id}
            data["employees"] = employees
            write_data(data)
            return jsonify(employees[i]), 200

    return jsonify({"error": "Employee not found"}), 404

@app.route('/api/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    data = read_data()
    employees = data.get("employees", [])
    
    updated_employees = [emp for emp in employees if emp["id_employee"] != id]
    
    if len(updated_employees) == len(employees):
        return jsonify({"error": "Employee not found"}), 404
        
    data["employees"] = updated_employees
    write_data(data)
    return jsonify({"message": "Employee deleted"}), 200

# -----------------------
# Equipment Routes
# -----------------------
@app.route('/api/equipment', methods=['GET'])
def get_equipment():
    data = read_data()
    equipment = [eq for eq in data.get('equipment', []) if eq]
    return jsonify(equipment)

@app.route('/api/equipment/<int:id>', methods=['GET'])
def get_single_equipment(id):
    data = read_data()
    equipment = data.get('equipment', [])
    item = next((eq for eq in equipment if eq.get('id_materiel') == id), None)
    if item:
        return jsonify(item)
    return jsonify({"error": "Equipment not found"}), 404

@app.route('/api/equipment', methods=['POST'])
def add_equipment():
    new_equipment = request.json
    if not new_equipment:
        return jsonify({"error": "Equipment data is required"}), 400
    
    data = read_data()
    equipment = data.get("equipment", [])
    
    new_id = max([eq['id_materiel'] for eq in equipment], default=0) + 1
    new_equipment["id_materiel"] = new_id
    
    equipment.append(new_equipment)
    data["equipment"] = equipment
    write_data(data)
    
    return jsonify(new_equipment), 201

@app.route('/api/equipment/<int:id>', methods=['PUT'])
def update_equipment(id):
    data = read_data()
    equipment = data.get("equipment", [])
    update_data = request.json

    for i, item in enumerate(equipment):
        if item["id_materiel"] == id:
            equipment[i] = {**item, **update_data, "id_materiel": id}
            data["equipment"] = equipment
            write_data(data)
            return jsonify(equipment[i]), 200

    return jsonify({"error": "Equipment not found"}), 404

@app.route('/api/equipment/<int:id>', methods=['DELETE'])
def delete_equipment(id):
    data = read_data()
    equipment = data.get("equipment", [])
    
    initial_count = len(equipment)
    equipment = [item for item in equipment if item["id_materiel"] != id]
    
    if len(equipment) == initial_count:
        return jsonify({"error": "Equipment not found"}), 404
        
    data["equipment"] = equipment
    write_data(data)
    return jsonify({"message": "Equipment deleted successfully"}), 200

# -----------------------
# Attribution Routes
# -----------------------
@app.route('/api/attributions', methods=['GET'])
def get_attributions():
    data = read_data()
    return jsonify(data.get('attributions', []))

@app.route('/api/attributions', methods=['POST'])
def create_attribution():
    data = read_data()
    attribution_data = request.json
    
    # Validate required fields
    if not all(k in attribution_data for k in ['id_employee', 'id_materiel']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if employee exists
    employee = next((e for e in data['employees'] if e['id_employee'] == attribution_data['id_employee']), None)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    # Check if equipment exists
    equipment = next((eq for eq in data['equipment'] if eq['id_materiel'] == attribution_data['id_materiel']), None)
    if not equipment:
        return jsonify({"error": "Equipment not found"}), 404
    
    # Update equipment status
    equipment['etat'] = 'Attribué'
    
    # Add to user's equipment list
    if 'equipment' not in employee:
        employee['equipment'] = []
    if attribution_data['id_materiel'] not in employee['equipment']:
        employee['equipment'].append(attribution_data['id_materiel'])
    
    # Create attribution record
    new_attribution = {
        "id_attribution": len(data.get('attributions', [])) + 1,
        "id_employee": attribution_data['id_employee'],
        "id_materiel": attribution_data['id_materiel'],
        "date_attribution": datetime.now().isoformat(),
        "date_retour": None
    }
    
    if 'attributions' not in data:
        data['attributions'] = []
    data['attributions'].append(new_attribution)
    
    write_data(data)
    return jsonify(new_attribution), 201

@app.route('/api/attributions/<int:id>/return', methods=['PUT'])
def return_equipment(id):
    data = read_data()
    attribution = next((a for a in data.get('attributions', []) if a['id_attribution'] == id), None)
    
    if not attribution:
        return jsonify({"error": "Attribution not found"}), 404
    
    # Find the employee
    employee = next((e for e in data['employees'] if e['id_employee'] == attribution['id_employee']), None)
    if employee and 'equipment' in employee:
        # Remove equipment from user's list
        employee['equipment'] = [eq_id for eq_id in employee['equipment'] if eq_id != attribution['id_materiel']]
    
    # Find the equipment and update status
    equipment = next((eq for eq in data['equipment'] if eq['id_materiel'] == attribution['id_materiel']), None)
    if equipment:
        equipment['etat'] = 'Disponible'
    
    # Update attribution record
    attribution['date_retour'] = datetime.now().isoformat()
    
    write_data(data)
    return jsonify(attribution), 200

# -----------------------
# Auth Routes
# -----------------------
@app.route('/api/auth/login', methods=['POST'])
def login():
    req = request.json
    email = req.get('email')
    password = req.get('password')

    users = read_data().get("users", [])
    for user in users:
        if user['email'] == email and user['password'] == password:
            # Send name and role in the login response
            return jsonify({
                "token": "fake-jwt-token",
                "name": user['name'],
                "role": user['role']
            }), 200

    return jsonify({"error": "Invalid email or password"}), 401


@app.route('/api/auth/register', methods=['POST'])
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    user = request.json
    email = user.get("email")
    name = user.get("name")
    password = user.get("password")
    role = user.get("role", "user")  # default to 'user'

    data = read_data()
    users = data.get("users", [])

    if any(u['email'] == email for u in users):
        return jsonify({"error": "User already exists"}), 409

    users.append({
        "name": name,
        "email": email,
        "password": password,
        "role": role  # send the role to the frontend
    })

    data["users"] = users
    write_data(data)

    # Send name and role in the response after successful registration
    return jsonify({
        "message": "User registered successfully",
        "name": name,
        "role": role
    }), 201

@app.route('/api/attributions/<int:id>', methods=['DELETE'])
def delete_attribution(id):
    data = read_data()
    attributions = data.get('attributions', [])
    
    # Find the attribution to delete
    attribution = next((a for a in attributions if a['id_attribution'] == id), None)
    if not attribution:
        return jsonify({"error": "Attribution not found"}), 404
    
    # Remove the attribution
    data['attributions'] = [a for a in attributions if a['id_attribution'] != id]
    
    # If equipment was assigned, mark it as available
    if not attribution.get('date_retour'):
        equipment = next((eq for eq in data['equipment'] 
                        if eq['id_materiel'] == attribution['id_materiel']), None)
        if equipment:
            equipment['etat'] = 'Disponible'
    
    write_data(data)
    return jsonify({"message": "Attribution deleted successfully"}), 200

# -----------------------
# Run Server
# -----------------------
if __name__ == '__main__':
    app.run(debug=True)