-- Create database
CREATE DATABASE IF NOT EXISTS handyman_db;
USE handyman_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('user', 'handyman', 'admin') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Handymen table
CREATE TABLE IF NOT EXISTS handymen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_type ENUM('electrician', 'plumber') NOT NULL,
    experience VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0,
    total_jobs INT DEFAULT 0,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    is_available BOOLEAN DEFAULT true,
    current_location_lat DECIMAL(10,8),
    current_location_lng DECIMAL(11,8),
    address TEXT,
    documents TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('electrician', 'plumber') NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    handyman_id INT NOT NULL,
    service_id INT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (handyman_id) REFERENCES handymen(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    handyman_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (handyman_id) REFERENCES handymen(id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Insert default admin user
INSERT INTO users (name, email, phone, password, user_type)
VALUES ('Admin', 'admin@multanhandyman.com', '+92 300 0000000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert default services
INSERT INTO services (category, name, description, base_price) VALUES
('electrician', 'AC Repair', 'Professional AC repair and maintenance service', 1000),
('electrician', 'Washing Machine Repair', 'Expert washing machine repair service', 800),
('electrician', 'Circuit Board Repair', 'Circuit board troubleshooting and repair', 500),
('electrician', 'Fan Installation', 'Ceiling fan installation service', 300),
('electrician', 'Light Fixing', 'Light fixture installation and repair', 200),
('electrician', 'General Wiring', 'Electrical wiring installation and repair', 1000),
('plumber', 'Tap/Faucet Fixing', 'Tap and faucet repair service', 300),
('plumber', 'Pipe Leakage', 'Pipe leakage detection and repair', 500),
('plumber', 'Water Motor Repair', 'Water motor repair and maintenance', 1000),
('plumber', 'Drain Cleaning', 'Professional drain cleaning service', 500),
('plumber', 'Water Tank Installation', 'Water tank installation service', 2000); 