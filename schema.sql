CREATE DATABASE IF NOT EXISTS finance_db;
USE finance_db;

CREATE TABLE IF NOT EXISTS pengguna (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    pin VARCHAR(50) NOT NULL,
    role ENUM('administrator', 'pencatat') DEFAULT 'pencatat',
    nama_lengkap VARCHAR(100) NULL,
    no_wa VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    foto LONGTEXT NULL,
    is_active TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS kantong (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(50) NOT NULL UNIQUE,
    is_active TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jenis ENUM('Pemasukan', 'Pengeluaran') NOT NULL,
    nama VARCHAR(50) NOT NULL UNIQUE,
    is_active TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS transaksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(50) NOT NULL UNIQUE,
    tanggal DATE NOT NULL,
    jenis ENUM('Pemasukan', 'Pengeluaran', 'Mutasi') NOT NULL,
    kategori_nama VARCHAR(50) NULL,
    nominal DECIMAL(15, 2) NOT NULL,
    kantong_asal VARCHAR(50) NULL,
    kantong_tujuan VARCHAR(50) NULL,
    catatan TEXT NULL,
    oleh VARCHAR(50) NOT NULL,
    link_bukti TEXT NULL
);

CREATE TABLE IF NOT EXISTS pengaturan (
    kunci VARCHAR(50) PRIMARY KEY,
    nilai TEXT NULL
);

-- Dummy data removed, replace with admin if needed
INSERT INTO kantong (nama) VALUES ('Dompet Tunai'), ('Rekening BCA'), ('Gopay') ON DUPLICATE KEY UPDATE nama=nama;
INSERT INTO kategori (jenis, nama) VALUES ('Pemasukan', 'Gaji'), ('Pengeluaran', 'Belanja Bulanan') ON DUPLICATE KEY UPDATE nama=nama;