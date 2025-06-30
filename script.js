const html5QrCode = new Html5Qrcode("reader");
let jsonData = []; // Menyimpan data CSV setelah dibaca

document.getElementById("uploadBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            const rows = csvData.split("\n");
            jsonData = rows.map(row => {
                const cols = row.split(",");
                return {
                    'Kode Produk': cols[0], // Ganti dengan indeks yang sesuai
                    // Tambahkan kolom lainnya sesuai kebutuhan
                };
            }).filter(item => item['Kode Produk']); // Menghilangkan item kosong
            
            // Simpan data ke localStorage
            localStorage.setItem('productData', JSON.stringify(jsonData));
            console.log(jsonData); // Menampilkan data ke console
            showNotification("File berhasil diunggah dan data disimpan!", "success");
            document.getElementById("scanBtn").style.display = "inline"; // Tampilkan tombol scan
        };
        reader.readAsText(file);
    } else {
        showNotification("Silakan pilih file CSV terlebih dahulu.", "error");
    }
});

document.getElementById("scanBtn").addEventListener("click", () => {
    document.getElementById("reader").style.display = "block"; // Tampilkan area pemindaian
    html5QrCode.start(
        { facingMode: "environment" }, 
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
            console.log(`QR Code Detected: ${decodedText}`);
            searchProductInCSV(decodedText);
            html5QrCode.stop();
        },
        (errorMessage) => {
            console.warn(`QR code scan error: ${errorMessage}`);
        }
    ).catch(err => {
        console.error(`Unable to start scanning: ${err}`);
    });
    document.getElementById("scanBtn").style.display = "none"; // Sembunyikan tombol scan
    document.getElementById("stop").style.display = "inline"; // Tampilkan tombol stop
});

document.getElementById("stop").addEventListener("click", () => {
    html5QrCode.stop();
    document.getElementById("reader").style.display = "none"; // Sembunyikan area pemindaian
    document.getElementById("stop").style.display = "none"; // Sembunyikan tombol stop
});

// Fungsi untuk mencari produk berdasarkan kode yang dipindai
function searchProductInCSV(productCode) {
    const storedData = localStorage.getItem('productData');
    if (storedData) {
        const products = JSON.parse(storedData);
        const product = products.find(item => item['Kode Produk'] === productCode); // Ganti 'Kode Produk' dengan nama kolom yang sesuai
        if (product) {
            document.getElementById("output").textContent = JSON.stringify(product, null, 2);
            showNotification(`Produk ditemukan: ${JSON.stringify(product)}`, "success");
        } else {
            document.getElementById("output").textContent = `Produk dengan kode ${productCode} tidak ditemukan.`;
            showNotification(`Produk dengan kode ${productCode} tidak ditemukan.`, "error");
        }
    } else {
        document.getElementById("output").textContent = "Data produk tidak ditemukan di localStorage.";
        showNotification("Data produk tidak ditemukan di localStorage.", "error");
    }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";

    // Ganti warna notifikasi sesuai tipe
    if (type === "success") {
        notification.style.borderColor = "#28a745";
        notification.style.backgroundColor = "#d4edda";
        notification.style.color = "#155724";
    } else if (type === "error") {
        notification.style.borderColor = "#dc3545";
        notification.style.backgroundColor = "#f8d7da";
        notification.style.color = "#721c24";
    }

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}