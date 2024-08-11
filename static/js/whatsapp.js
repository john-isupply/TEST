let selectedMessageNumber = null;
let messages = [
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nمش موجود\nوالاوردر مش مكمل فاتوره\nوتم الغاء الاوردر\nوتم وضع الاودر علي الكارت`,
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nمش موجود\nوالاوردر مش مكمل فاتوره\nبرجاء تكمله الاوردر`,
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nكوته\n علب {line3}\nالاوردر مش مكمل فاتوره\nوتم الغاء الاوردر\nوتم وضع الاودر علي الكارت`,
    `مساء الخير يا دكتور\nمع حضرتك اى سبلاي\nبكلم حضرتك بخصوص اوردر مخزن\n{line1}\nصنف\n{line2}\nفيه خطأ فيه نسبه الخصم\nهايوصل لحضرتك بخصم\n{line3}%`
];

function toggleSettings() {
    const settingsContainer = document.getElementById('settings-container');
    settingsContainer.classList.toggle('show');
    if (settingsContainer.classList.contains('show')) {
        document.getElementById('message1').value = messages[0];
        document.getElementById('message2').value = messages[1];
        document.getElementById('message3').value = messages[2];
        document.getElementById('message4').value = messages[3];
    } else {
        const fontSize = localStorage.getItem('fontSize') || 16;
        document.getElementById('message-preview').style.fontSize = `${fontSize}px`;
    }
}

function saveSettings() {
    messages[0] = document.getElementById('message1').value;
    messages[1] = document.getElementById('message2').value;
    messages[2] = document.getElementById('message3').value;
    messages[3] = document.getElementById('message4').value;

    toggleSettings();
}

function selectMessage(messageNumber) {
    selectedMessageNumber = messageNumber;
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach((item, index) => {
        if (index === messageNumber - 1) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    updateMessagePreview();

    const line3Label = document.getElementById('line3-label');
    const line3Input = document.getElementById('line3');
    if (messageNumber === 3) {
        line3Label.textContent = "كوته";
        line3Label.style.display = 'block';
        line3Input.style.display = 'block';
    } else if (messageNumber === 4) {
        line3Label.textContent = "فرق خصم";
        line3Label.style.display = 'block';
        line3Input.style.display = 'block';
    } else {
        line3Label.style.display = 'none';
        line3Input.style.display = 'none';
    }
}

function updateMessagePreview() {
    if (selectedMessageNumber !== null) {
        const line1 = document.getElementById('line1').value;
        const line2 = document.getElementById('line2').value;
        const line3 = document.getElementById('line3').value || "";

        let message = messages[selectedMessageNumber - 1]
            .replace("{line1}", line1)
            .replace("{line2}", line2)
            .replace("{line3}", line3);

        document.getElementById('message-preview').value = message;
    }
}

document.getElementById('line1').addEventListener('input', updateMessagePreview);
document.getElementById('line2').addEventListener('input', updateMessagePreview);
document.getElementById('line3').addEventListener('input', updateMessagePreview);

document.getElementById('line2').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('line3').focus();
    }
});

document.getElementById('line2').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
        const input = document.getElementById('line2');
        const start = input.selectionStart;
        const end = input.selectionEnd;

        input.value = input.value.substring(0, start) + '\n' + input.value.substring(end);
        input.selectionStart = input.selectionEnd = start + 1;
        e.preventDefault();
    }
});

function sendMessage() {
    if (selectedMessageNumber === null) {
        alert("Please select a message first.");
        return;
    }

    let whatsappNumber = document.getElementById('whatsapp-number').value;
    if (!whatsappNumber.startsWith('+2')) {
        whatsappNumber = '+2' + whatsappNumber;
    }

    const line1 = document.getElementById('line1').value;
    const line2 = document.getElementById('line2').value;
    const line3 = document.getElementById('line3').value || "";

    let message = document.getElementById('message-preview').value;

    const whatsappLink = document.getElementById('whatsapp-link');
    whatsappLink.href = 'whatsapp://send?phone=' + encodeURIComponent(whatsappNumber) + '&text=' + encodeURIComponent(message);
    whatsappLink.style.display = 'block';
    whatsappLink.click();
}

function sendLink() {
    const orderId = document.getElementById('order-id').value;
    const fixedNumber = "+201050971225";
    const fixedMessage = orderId;

    const fixedWhatsappLink = document.getElementById('fixed-whatsapp-link');
    fixedWhatsappLink.href = 'whatsapp://send?phone=' + encodeURIComponent(fixedNumber) + '&text=' + encodeURIComponent(fixedMessage);
    fixedWhatsappLink.style.display = 'block';
    fixedWhatsappLink.click();
}

document.getElementById('whatsapp-number').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const firstMessageItem = document.querySelector('.message-list .message-item');
        firstMessageItem.click(); // تحديد الرسالة الأولى تلقائيًا
        document.getElementById('line1').focus(); // الانتقال إلى الحقل التالي بعد تحديد الرسالة
    }
});

document.querySelectorAll('.message-item').forEach((item) => {
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            selectMessage(Array.from(item.parentNode.children).indexOf(item) + 1);
            document.getElementById('line1').focus();
        }
    });
});

document.getElementById('line1').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('line2').focus();
    }
});

document.getElementById('line3').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
        document.getElementById('order-id').focus();
    }
});

document.getElementById('order-id').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendLink();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const fontSize = localStorage.getItem('fontSize') || 16;
    document.getElementById('message-preview').style.fontSize = `${fontSize}px`;
});
