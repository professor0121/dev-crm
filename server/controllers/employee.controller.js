const Employee = require('../models/employee.model');

// Get All Employees (Admin only)
exports.getAllEmployees = async (req, res) => {
    try {
        // Create a copy of query parameters and exclude pagination/sorting fields
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Convert query object to a string and add MongoDB operators
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

        // Initialize the query with the parsed query string
        let query = Employee.find(JSON.parse(queryStr));

        // Add search functionality if 'search' parameter is present
        if (req.query.search) {
            const searchString = req.query.search;
            query = query.find({
                $or: [
                    { name: { $regex: searchString, $options: 'i' } },
                    { email: { $regex: searchString, $options: 'i' } },
                    { phone: { $regex: searchString, $options: 'i' } },
                    { position: { $regex: searchString, $options: 'i' } },
                    { department: { $regex: searchString, $options: 'i' } }
                ]
            });
        }

        // Add sorting functionality if 'sort' parameter is present
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Select specific fields if 'fields' parameter is present
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Handle pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        query = query.skip(startIndex).limit(limit);

        // Execute the query and return the results
        const employees = await query;
        res.json(employees);
    } catch (error) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: error.message });
    }
};

// Get Employee by ID (Admin only)
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Employee (Admin only)
exports.addEmployee = async (req, res) => {
    const { name, email, phone, position, department, hireDate } = req.body;

    try {
        const employee = new Employee({
            name,
            email,
            phone,
            position,
            department,
            hireDate
        });

        const createdEmployee = await employee.save();
        res.status(201).json(createdEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Employee (Admin only)
exports.updateEmployee = async (req, res) => {
    const { name, email, phone, position, department, hireDate } = req.body;

    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            employee.name = name || employee.name;
            employee.email = email || employee.email;
            employee.phone = phone || employee.phone;
            employee.position = position || employee.position;
            employee.department = department || employee.department;
            employee.hireDate = hireDate || employee.hireDate;

            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Employee (Admin only)
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            await employee.remove();
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
