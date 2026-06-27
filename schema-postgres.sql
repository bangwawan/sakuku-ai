CREATE TABLE IF NOT EXISTS pengguna (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    pin VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'pencatat',
    nama_lengkap VARCHAR(100) NULL,
    no_wa VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    foto TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS kantong (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS kategori (
    id SERIAL PRIMARY KEY,
    jenis VARCHAR(20) NOT NULL,
    nama VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS transaksi (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(50) NOT NULL UNIQUE,
    tanggal DATE NOT NULL,
    jenis VARCHAR(20) NOT NULL,
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

INSERT INTO kantong (nama) VALUES ('Dompet Tunai'), ('Rekening BCA'), ('Gopay') ON CONFLICT (nama) DO NOTHING;
INSERT INTO kategori (jenis, nama) VALUES ('Pemasukan', 'Gaji'), ('Pengeluaran', 'Belanja Bulanan') ON CONFLICT (nama) DO NOTHING;
