document.addEventListener('DOMContentLoaded', () => {
    const addUserButton = document.getElementById('addUserButton');
    const editUserButton = document.getElementById('editUserButton');
    const permissionsButton = document.getElementById('permissionsButton');
    
    const addUserContainer = document.getElementById('addUserContainer');
    const editUserContainer = document.getElementById('editUserContainer');
    const permissionsContainer = document.getElementById('permissionsContainer');
    
    addUserButton.addEventListener('click', () => {
        addUserContainer.style.display = 'block';
        editUserContainer.style.display = 'none';
        permissionsContainer.style.display = 'none';
    });

    editUserButton.addEventListener('click', () => {
        addUserContainer.style.display = 'none';
        editUserContainer.style.display = 'block';
        permissionsContainer.style.display = 'none';
    });

    permissionsButton.addEventListener('click', () => {
        addUserContainer.style.display = 'none';
        editUserContainer.style.display = 'none';
        permissionsContainer.style.display = 'block';
    });

    // معالجة إرسال نموذج إضافة المستخدم
    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // إرسال البيانات للخادم (يجب إضافة endpoint في app.py)
        fetch('/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('تمت إضافة المستخدم بنجاح!');
                addUserForm.reset();
            } else {
                alert('حدث خطأ أثناء إضافة المستخدم.');
            }
        });
    });
});
