DROP DATABASE IF EXISTS job_portal_db;
CREATE DATABASE job_portal_db;
USE job_portal_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','jobseeker','recruiter') NOT NULL DEFAULT 'jobseeker',
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  location VARCHAR(150),
  recruiter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(150) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  salary VARCHAR(100),
  skills VARCHAR(500),
  deadline DATE,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  jobseeker_id INT NOT NULL,
  resume VARCHAR(255),
  cover_letter TEXT,
  status ENUM('applied','shortlisted','rejected','selected') DEFAULT 'applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application (job_id, jobseeker_id),
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (jobseeker_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Demo users. Password for all demo accounts: 123456
-- bcrypt hash generated for 123456
INSERT INTO users (name,email,password,role) VALUES
('System Admin','admin@test.com','$2a$10$P6QyR6Q0LQWzH8fQy8H9.eP4ZxM3o4e8d1Zkq4pVh3vWmQ3Xc4p8G','admin'),
('Test Job Seeker','jobseeker@test.com','$2a$10$P6QyR6Q0LQWzH8fQy8H9.eP4ZxM3o4e8d1Zkq4pVh3vWmQ3Xc4p8G','jobseeker'),
('Test Recruiter','recruiter@test.com','$2a$10$P6QyR6Q0LQWzH8fQy8H9.eP4ZxM3o4e8d1Zkq4pVh3vWmQ3Xc4p8G','recruiter');

INSERT INTO companies (company_name,description,website,location,recruiter_id)
VALUES ('Tech Solutions Pvt Ltd','Modern software and product engineering company.','https://example.com','Vijayawada',3);

INSERT INTO jobs (company_id,title,description,location,job_type,salary,skills,deadline,status)
VALUES
(1,'React Frontend Developer','Build modern responsive interfaces using React and JavaScript.','Vijayawada','Full-Time','6-10 LPA','React, JavaScript, HTML, CSS',DATE_ADD(CURDATE(), INTERVAL 60 DAY),'approved'),
(1,'Node.js Backend Developer','Develop REST APIs and backend services for scalable applications.','Hyderabad','Full-Time','7-12 LPA','Node.js, Express, MySQL, REST API',DATE_ADD(CURDATE(), INTERVAL 75 DAY),'approved'),
(1,'UI/UX Intern','Work with the product team to create clean and useful user experiences.','Remote','Internship','15K/month','Figma, UI Design, UX Research',DATE_ADD(CURDATE(), INTERVAL 45 DAY),'pending');

INSERT INTO applications (job_id,jobseeker_id,cover_letter,status)
VALUES (1,2,'I am interested in the React developer position and would love to contribute to your team.','applied');
