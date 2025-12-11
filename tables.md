-- ----------------------------------------
-- 1. CREATE DATABASE
-- ----------------------------------------
CREATE DATABASE FIRMAnagemntSystem;
USE FIRMAnagemntSystem;

-- ----------------------------------------
-- 2. MAIN ENTITIES
-- ----------------------------------------

-- COMPLAINANT TABLE
CREATE TABLE Complainant (
    complainant_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    cnic VARCHAR(50) NOT NULL,
    address VARCHAR(200)
);

-- POLICE STATION TABLE
CREATE TABLE PoliceStation (
    station_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL
);

-- OFFICER TABLE
CREATE TABLE Officer (
    officer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    station_id INT,
    name VARCHAR(50) NOT NULL,
    officer_rank VARCHAR(50) NOT NULL,
    FOREIGN KEY (station_id) REFERENCES PoliceStation(station_id)
);

-- CRIME CATEGORY TABLE
CREATE TABLE CrimeCategory (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- CRIME TYPE TABLE
CREATE TABLE CrimeType (
    type_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES CrimeCategory(category_id)
);

-- ----------------------------------------
-- 3. FIR TABLE
-- ----------------------------------------
CREATE TABLE FIR (
    fir_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    complainant_id INT NOT NULL,
    officer_id INT,
    station_id INT,
    type_id INT,
    date_filed DATETIME,
    description VARCHAR(2000),
    status ENUM('pending','investigation','solved','closed') NOT NULL,
    location VARCHAR(200),
    FOREIGN KEY (complainant_id) REFERENCES Complainant(complainant_id),
    FOREIGN KEY (officer_id) REFERENCES Officer(officer_id),
    FOREIGN KEY (station_id) REFERENCES PoliceStation(station_id),
    FOREIGN KEY (type_id) REFERENCES CrimeType(type_id)
);

-- ----------------------------------------
-- 4. RELATED TABLES (DEPENDENT ON FIR)
-- ----------------------------------------

-- CASE STATUS HISTORY
CREATE TABLE CaseStatusHistory (
    history_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fir_id INT NOT NULL,
    date_filed DATETIME,
    description VARCHAR(2000),
    status ENUM('pending','investigation','solved','closed') NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (fir_id) REFERENCES FIR(fir_id)
);

-- EVIDENCE TABLE
CREATE TABLE Evidence (
    evidence_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fir_id INT NOT NULL,
    file_url VARCHAR(500),
    evidence_type ENUM('image','video','document'),
    uploaded_at DATETIME,
    FOREIGN KEY (fir_id) REFERENCES FIR(fir_id)
);

-- SUSPECT TABLE
CREATE TABLE Suspect (
    suspect_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fir_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    cnic VARCHAR(50) NOT NULL,
    description VARCHAR(2000),
    isVerified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (fir_id) REFERENCES FIR(fir_id)
);

-- ARREST TABLE
CREATE TABLE Arrest (
    arrest_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    suspect_id INT,
    fir_id INT,
    officer_id INT,
    arrest_date DATETIME,
    description VARCHAR(100),
    FOREIGN KEY (suspect_id) REFERENCES Suspect(suspect_id),
    FOREIGN KEY (fir_id) REFERENCES FIR(fir_id),
    FOREIGN KEY (officer_id) REFERENCES Officer(officer_id)
);
