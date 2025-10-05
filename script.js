// Data paket produk
const packages = {
    'Panel Run Bot': [
        { name: '1GB RAM / 10% CPU', price: 1000 },
        { name: '2GB RAM / 20% CPU', price: 2000 },
        { name: '3GB RAM / 30% CPU', price: 3000 },
        { name: '4GB RAM / 40% CPU', price: 4000 },
        { name: '5GB RAM / 50% CPU', price: 5000 },
        { name: '6GB RAM / 60% CPU', price: 6000 },
        { name: '7GB RAM / 70% CPU', price: 7000 },
        { name: '8GB RAM / 80% CPU', price: 8000 },
        { name: '9GB RAM / 90% CPU', price: 9000 },
        { name: '10GB RAM / 100% CPU', price: 10000 },
        { name: 'UNLIMITED RAM & CPU', price: 13000 }
    ],
    'Bot Push Kontak': [
        { name: 'Mingguan', price: 5000 },
        { name: 'Bulanan', price: 10000 }
    ],
    'Sewa Bot WA': [
        { name: 'Harian', price: 2000 },
        { name: 'Mingguan', price: 7000 },
        { name: 'Bulanan', price: 15000 }
    ],
    'Reseller Panel': [
        { name: 'Bulanan', price: 10000 }
    ]
};

let countdownInterval;
let currentOrderData = {};

// Fungsi membuka modal pemesanan
function openOrderModal(productName) {
    const modal = document.getElementById('orderModal');
    const productInput = document.getElementById('productName');
    const packageSelect = document.getElementById('packageSelect');
    
    // Set nama produk
    productInput.value = productName;
    
    // Reset form
    document.getElementById('orderForm').reset();
    productInput.value = productName; // Set lagi setelah reset
    
    // Isi dropdown paket
    packageSelect.innerHTML = '<option value="">-- Pilih Paket --</option>';
    packages[productName].forEach((pkg, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${pkg.name} - Rp ${pkg.price.toLocaleString('id-ID')}`;
        packageSelect.appendChild(option);
    });
    
    // Tampilkan modal dan form, sembunyikan payment section
    modal.style.display = 'block';
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('paymentSection').style.display = 'none';
}

// Fungsi menutup modal
function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('orderForm').style.display = 'block';
    clearInterval(countdownInterval);
    currentOrderData = {};
}

// Event listener untuk form submit
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ambil data form
    const customerName = document.getElementById('customerName').value.trim();
    const customerWA = document.getElementById('customerWA').value.trim();
    const productName = document.getElementById('productName').value;
    const packageIndex = document.getElementById('packageSelect').value;
    const orderNote = document.getElementById('orderNote').value.trim();
    
    // Validasi
    if (!customerName) {
        alert('❌ Nama lengkap harus diisi!');
        return;
    }
    
    if (!customerWA) {
        alert('❌ Nomor WhatsApp harus diisi!');
        return;
    }
    
    if (packageIndex === '') {
        alert('❌ Silakan pilih paket terlebih dahulu!');
        return;
    }
    
    // Ambil data paket
    const packageData = packages[productName][parseInt(packageIndex)];
    
    // Simpan data pesanan
    currentOrderData = {
        customerName: customerName,
        customerWA: customerWA,
        productName: productName,
        packageName: packageData.name,
        price: packageData.price,
        orderNote: orderNote
    };
    
    // Tampilkan ringkasan pesanan
    document.getElementById('summaryName').textContent = customerName;
    document.getElementById('summaryProduct').textContent = productName;
    document.getElementById('summaryPackage').textContent = packageData.name;
    document.getElementById('summaryPrice').textContent = `Rp ${packageData.price.toLocaleString('id-ID')}`;
    
    // Sembunyikan form, tampilkan payment section
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'block';
    
    // Mulai countdown
    startCountdown();
});

// Fungsi untuk memulai countdown timer
function startCountdown() {
    let timeLeft = 300; // 5 menit = 300 detik
    
    const countdownElement = document.getElementById('countdown');
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Ubah warna jika waktu kurang dari 1 menit
        if (timeLeft <= 60) {
            countdownElement.style.color = '#dc3545';
        }
        
        // Waktu habis
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            alert('⏰ Waktu pembayaran habis! Silakan pesan ulang.');
            closeModal();
        }
    }, 1000);
}

// Fungsi copy nomor DANA
function copyDanaNumber() {
    const danaNumber = '085693404164';
    
    // Cara modern untuk copy
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(danaNumber).then(() => {
            alert('✅ Nomor DANA berhasil disalin!\n\n085693404164');
        }).catch(() => {
            // Fallback jika gagal
            copyToClipboardFallback(danaNumber);
        });
    } else {
        // Fallback untuk browser lama
        copyToClipboardFallback(danaNumber);
    }
}

// Fallback method untuk copy
function copyToClipboardFallback(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('✅ Nomor DANA berhasil disalin!\n\n085693404164');
    } catch (err) {
        alert('❌ Gagal menyalin nomor. Silakan salin manual:\n\n085693404164');
    }
    
    document.body.removeChild(textArea);
}

// Fungsi konfirmasi pembayaran
function confirmPayment() {
    if (!currentOrderData.customerName) {
        alert('❌ Terjadi kesalahan. Silakan pesan ulang.');
        closeModal();
        return;
    }
    
    // Format pesan WhatsApp
    const message = `*🔔 KONFIRMASI PEMBAYARAN SALMAN STORE*

📋 *Detail Pesanan:*
━━━━━━━━━━━━━━━━━━
👤 Nama: ${currentOrderData.customerName}
📱 No. WA: ${currentOrderData.customerWA}
🛍️ Produk: ${currentOrderData.productName}
📦 Paket: ${currentOrderData.packageName}
💰 Total: Rp ${currentOrderData.price.toLocaleString('id-ID')}
${currentOrderData.orderNote ? `📝 Catatan: ${currentOrderData.orderNote}` : ''}
━━━━━━━━━━━━━━━━━━

✅ Saya sudah melakukan transfer ke:
💳 DANA: 085693404164

Mohon segera diproses. Terima kasih! 🙏`;
    
    // URL WhatsApp dengan nomor admin
    const adminWA = '6285133061046';
    const waUrl = `https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`;
    
    // Buka WhatsApp
    window.open(waUrl, '_blank');
    
    // Notifikasi
    alert('✅ Silakan kirim bukti transfer ke WhatsApp admin!\n\nAnda akan diarahkan ke WhatsApp...');
    
    // Tutup modal setelah 2 detik
    setTimeout(() => {
        closeModal();
    }, 2000);
}

// Event listener untuk klik di luar modal (menutup modal)
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        if (confirm('Apakah Anda yakin ingin membatalkan pesanan?')) {
            closeModal();
        }
    }
}

// Event listener ketika halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('Salman Store Website loaded successfully! ⚡');
});