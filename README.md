# Collaborative Secure File Editor

A web application that allows users to **create, share, and securely manage files online** with password protection. Owners can set separate **edit** and **view** passwords, and users receive notifications whenever someone interacts with their files.

---

## Features

- User authentication (signup/login)  
- Create files **directly on the website** with **edit** and **view** passwords  
- Passwords are securely stored using **bcrypt hashing**  
- Non-owners require the correct password to view or edit files  
- File owners receive notifications when their files are viewed or edited  
- Owners can update **edit/view passwords** anytime  

---

## Technology Stack

- **Frontend:** React + Vite, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication & Security:** JWT, bcrypt for password hashing  

---

## Installation

1. Clone the repository:  
   ```bash
    git clone https://github.com/sreeram5555/document-management.git
    cd document-management
