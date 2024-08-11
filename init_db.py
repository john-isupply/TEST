import sqlite3
import bcrypt

# الاتصال بقاعدة البيانات وإنشاءها إذا لم تكن موجودة
conn = sqlite3.connect('users.db')
c = conn.cursor()

# إنشاء جدول المستخدمين
c.execute('''
          CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL,
              password TEXT NOT NULL,
              access_level TEXT NOT NULL
          )
          ''')

# إنشاء مستخدم مسؤول مع كلمة مرور مشفرة
admin_username = 'john magdy'
admin_password = 'j0hnm@gdy'  # استخدم كلمة مرور آمنة
hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt())

# إضافة المستخدم المسؤول إلى قاعدة البيانات
c.execute('''
          INSERT INTO users (username, password, access_level)
          VALUES (?, ?, ?)
          ''', (admin_username, hashed_password, 'all'))

conn.commit()
conn.close()

print("Database initialized and admin user added.")
