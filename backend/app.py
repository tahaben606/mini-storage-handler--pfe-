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

    # Vérifie si un employé avec le même email existe déjà
    for emp in employees:
        if emp.get("email") == new_employee.get("email"):
            return jsonify({"error": "Cet employé existe déjà avec cet email."}), 400

    # Ajoute l'employé s'il n'existe pas
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
    new_equipment = request.get_json()
    print("Received equipment data:", new_equipment)

    equipment = {
        'type_materiel': new_equipment.get('type_materiel'),
        'marque': new_equipment.get('marque'),
        'modele': new_equipment.get('modele'),
        'etat': new_equipment.get('etat'),
        'price': new_equipment.get('price'),
        'date_achat': new_equipment.get('date_achat'),
        'quantity': new_equipment.get('quantity')
    }

    data = read_data()
    equipment_list = data.get("equipment", [])

    equipment['id_materiel'] = len(equipment_list) + 1  # Ajoute un ID unique
    equipment_list.append(equipment)
    data["equipment"] = equipment_list
    write_data(data)

    return jsonify({'message': 'Équipement ajouté avec succès'}), 201






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
    if not all(k in attribution_data for k in ['id_employee', 'id_materiel', 'quantity']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if employee exists
    employee = next((e for e in data['employees'] if e['id_employee'] == attribution_data['id_employee']), None)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    # Check if equipment exists and has sufficient quantity
    equipment = next((eq for eq in data['equipment'] if eq['id_materiel'] == attribution_data['id_materiel']), None)
    if not equipment:
        return jsonify({"error": "Equipment not found"}), 404
    
    requested_quantity = int(attribution_data.get('quantity', 1))
    if equipment.get('quantity', 0) < requested_quantity:
        return jsonify({"error": "Insufficient quantity available"}), 400
    
    # Update equipment quantity
    equipment['quantity'] -= requested_quantity
    
    # Mark as unavailable if quantity reaches 0
    if equipment['quantity'] <= 0:
        equipment['etat'] = 'Indisponible'
    
    # Create attribution record
    new_attribution = {
        "id_attribution": len(data.get('attributions', [])) + 1,
        "id_employee": attribution_data['id_employee'],
        "id_materiel": attribution_data['id_materiel'],
        "quantity": requested_quantity,
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
    try:
        data = read_data()
        attribution = next((a for a in data.get('attributions', []) if a['id_attribution'] == id), None)

        if not attribution:
            return jsonify({"error": "Attribution not found"}), 404
        
        # Vérifie si l'attribution a déjà été retournée
        if attribution.get('date_retour'):
            return jsonify({
                "error": "Equipment already returned",
                "return_date": attribution['date_retour']
            }), 400
        
        # Optionnel: vérifier que les données de retour sont envoyées correctement
        if 'quantity' not in attribution:
            return jsonify({"error": "Missing 'quantity' field in return data"}), 400
        
        returned_quantity = int(attribution['quantity'])

        # Vérifie si la quantité est valide
        if returned_quantity <= 0:
            return jsonify({"error": "Quantity must be positive"}), 400

        # Mettre à jour l'équipement retourné
        equipment = next((eq for eq in data['equipment'] if eq['id_materiel'] == attribution['id_materiel']), None)
        if equipment:
            equipment['quantity'] += returned_quantity
            equipment['etat'] = 'Disponible' if equipment['quantity'] > 0 else 'Indisponible'

        # Mise à jour de l'attribution
        attribution['date_retour'] = datetime.now().isoformat()

        write_data(data)
        return jsonify({
            "message": "Equipment returned successfully",
            "attribution_id": id,
            "equipment_id": attribution['id_materiel'],
            "returned_quantity": returned_quantity,
            "new_quantity": equipment['quantity'],
            "status": equipment['etat']
        }), 200

    except Exception as e:
        return jsonify({
            "error": "An error occurred while processing the return",
            "details": str(e),
            "attribution_id": id
        }), 500

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
    
    # Cherche toutes les attributions avec cet ID
    attributions = [a for a in data.get('attributions', []) if a['id_attribution'] == id]

    # Vérifie qu'on a exactement une attribution (pas 0, pas plusieurs)
    if len(attributions) != 1:
        return jsonify({"error": "Attribution not found or duplicate IDs"}), 400

    attribution = attributions[0]

    # Supprimer l'attribution
    data['attributions'] = [a for a in data['attributions'] if a['id_attribution'] != id]
    
    # Si elle n'a pas encore été retournée, on remet l'état du matériel à 'Disponible'
    if not attribution.get('date_retour'):
        equipment = next((eq for eq in data['equipment'] if eq['id_materiel'] == attribution['id_materiel']), None)
        if equipment:
            equipment['etat'] = 'Disponible'

    write_data(data)
    return jsonify({"message": "Attribution deleted successfully"}), 200


# -----------------------
# Run Server
# -----------------------
if __name__ == '__main__':
    app.run(debug=True)