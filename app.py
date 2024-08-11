from flask import Flask, render_template, request, redirect, url_for, session, jsonify

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # مفتاح سري لجلسة Flask

# بيانات المستخدمين الافتراضية
users = {
    'admin': {'password': 'password', 'role': 'admin'},
    'user1': {'password': 'userpass', 'role': 'user'}
}

# الصفحة الرئيسية - تسجيل الدخول
@app.route('/', methods=['GET', 'POST'])
def login():
    error = None
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # تحقق من بيانات تسجيل الدخول
        if username in users and users[username]['password'] == password:
            session['username'] = username
            session['role'] = users[username]['role']
            return redirect(url_for('dashboard'))
        else:
            error = 'خطأ في اسم المستخدم أو كلمة المرور.'
    
    return render_template('login.html', error=error)

# لوحة التحكم
@app.route('/dashboard')
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    return render_template('dashboard.html')

# تطبيق WhatsApp
@app.route('/whatsapp')
def whatsapp():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    return render_template('whatsapp.html')

# تطبيق Ask i'Supply Assistant
@app.route('/ask-supply-assistant')
def ask_supply_assistant():
    if 'username' not in session:
        return redirect(url_for('login'))
    
    return render_template('ask_john.html')

# صفحة CONTROL للإدارة
@app.route('/control')
def control():
    if 'username' not in session or session['role'] != 'admin':
        return redirect(url_for('login'))
    
    return render_template('control.html')

# Endpoint لإضافة مستخدم جديد
@app.route('/add-user', methods=['POST'])
def add_user():
    if 'username' not in session or session['role'] != 'admin':
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if username in users:
        return jsonify({'success': False, 'message': 'User already exists'}), 400

    users[username] = {'password': password, 'role': role}
    return jsonify({'success': True, 'message': 'User added successfully'})

# تسجيل الخروج
@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('role', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
