# Dev CRM Server

This is the backend server for the Dev CRM application. It is built with Node.js and Express, and it provides RESTful APIs for authentication, user management, and other core functionalities.

## 📦 Dependencies

Below are the essential dependencies used in this application and their purposes:

### 1. **express**
- **What:** A fast, unopinionated, minimalist web framework for Node.js.
- **Use:** Handles routing, middleware configuration, and HTTP request/response handling.

### 2. **mongoose**
- **What:** An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Use:** Provides a schema-based solution to model and interact with application data in MongoDB easily.

### 3. **dotenv**
- **What:** A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **Use:** Manages environment-specific configurations securely and conveniently.

### 4. **bcryptjs**
- **What:** A library for hashing passwords securely.
- **Use:** Used for securely hashing and salting user passwords during authentication processes.

### 5. **jsonwebtoken**
- **What:** A library to sign, verify, and decode JSON Web Tokens (JWT).
- **Use:** Enables secure user authentication and authorization by generating and validating JWTs.

### 6. **cookie-parser**
- **What:** Middleware for parsing cookies attached to client requests.
- **Use:** Helps in managing cookies for session management, user tracking, and authentication support.

---

## 🚀 Getting Started
# 📊 CRM System – Entities, Attributes, and Relationships

This document outlines the core entities, their attributes, and the relationships within the CRM system.

---

## 🧍‍♂️ Customer

| Attribute     | Description                                 |
|---------------|---------------------------------------------|
| CustomerID    | **Primary Key**. Unique identifier          |
| Name          | Customer's full name                        |
| Email         | Customer's email address                    |
| Phone         | Customer's contact number                   |
| Address       | Full address including city, state, and ZIP |

---

## 📦 Product

| Attribute        | Description                               |
|------------------|-------------------------------------------|
| ProductID        | **Primary Key**. Unique identifier        |
| Name             | Name of the product                       |
| Description      | Details about the product                 |
| Price            | Price of the product                      |
| Category         | Category under which the product falls    |
| Brand            | Brand of the product                      |
| QuantityInStock  | Current stock level                       |

---

## 🧾 Order

| Attribute        | Description                                       |
|------------------|---------------------------------------------------|
| OrderID          | **Primary Key**. Unique identifier                |
| CustomerID       | **Foreign Key** → Customer                        |
| OrderDate        | Date when the order was placed                    |
| TotalAmount      | Total price for the order                         |
| Status           | Current status (Pending, Shipped, Delivered, etc.)|
| PaymentMethod    | Payment method used (Card, UPI, etc.)             |
| ShippingAddress  | Destination address for delivery                  |

---

## 📋 Order Detail

| Attribute       | Description                                |
|-----------------|--------------------------------------------|
| OrderDetailID   | **Primary Key**. Unique identifier         |
| OrderID         | **Foreign Key** → Order                    |
| ProductID       | **Foreign Key** → Product                  |
| Quantity        | Number of units ordered                    |
| UnitPrice       | Price per unit                             |
| Subtotal        | UnitPrice × Quantity                       |
| Discount        | Discount applied (if any)                  |

---

## 👩‍💼 Employee

| Attribute    | Description                              |
|--------------|------------------------------------------|
| EmployeeID   | **Primary Key**. Unique identifier       |
| Name         | Employee's full name                     |
| Email        | Employee's email address                 |
| Phone        | Employee's contact number                |
| Position     | Job title or designation                 |
| Department   | Department the employee belongs to       |
| HireDate     | Date of joining                          |

---

## 📅 Activity

| Attribute    | Description                              |
|--------------|------------------------------------------|
| ActivityID   | **Primary Key**. Unique identifier       |
| Type         | Type or category of activity             |
| Description  | Activity details                         |
| Date         | Date of activity                         |
| Time         | Time of activity                         |
| Location     | Where it took place                      |
| Duration     | Total time taken                         |
| Participants | Employees or users involved              |

---

## 🔗 Relationships

### 1. **Customer → Order**  
- **Type:** One-to-Many  
- **Explanation:** A single customer can place multiple orders.  
- **Implementation:** `CustomerID` as foreign key in `Order`.

---

### 2. **Order → Order Detail**  
- **Type:** One-to-Many  
- **Explanation:** One order can contain multiple items.  
- **Implementation:** `OrderID` as foreign key in `OrderDetail`.

---

### 3. **Product → Order Detail**  
- **Type:** One-to-Many  
- **Explanation:** A product can appear in multiple orders.  
- **Implementation:** `ProductID` as foreign key in `OrderDetail`.

---

### 4. **Employee → Order Detail**  
- **Type:** One-to-Many *(if assigned)*  
- **Explanation:** An employee can manage multiple order entries.

---

### 5. **Employee → Activity**  
- **Type:** One-to-Many  
- **Explanation:** An employee can participate in multiple activities.  
- **Implementation:** `EmployeeID` associated with `Activity.Participants` (as list or relational link table).

---

## 📝 Notes
- You can normalize `Participants` in the `Activity` table by creating an `ActivityParticipants` junction table if you need many-to-many support.
- Data integrity should be enforced via Mongoose or SQL constraints based on your backend choice.

---

Would you like an **ERD diagram image** or a **Mongoose schema version** of this next?
