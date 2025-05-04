const Customer = require('../models/customer.model');

// Get All Customers (Admin only)
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Customer by ID (Admin and assigned employee)
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            if (req.user.role === 'admin' || customer.employee.toString() === req.user._id.toString()) {
                res.json(customer);
            } else {
                res.status(401).json({ message: 'Not authorized to access this customer' });
            }
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Customer (Admin and assigned employee)
exports.addCustomer = async (req, res) => {
    const { name, email, phone, address, employee } = req.body;

    try {
        const customer = new Customer({
            name,
            email,
            phone,
            address,
            employee
        });

        const createdCustomer = await customer.save();
        res.status(201).json(createdCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Customer (Admin and assigned employee)
exports.updateCustomer = async (req, res) => {
    const { name, email, phone, address, employee } = req.body;

    try {
        const customer = await Customer.findById(req.params.id);

        if (customer) {
            if (req.user.role === 'admin' || customer.employee.toString() === req.user._id.toString()) {
                customer.name = name || customer.name;
                customer.email = email || customer.email;
                customer.phone = phone || customer.phone;
                customer.address = address || customer.address;
                customer.employee = employee || customer.employee;

                const updatedCustomer = await customer.save();
                res.json(updatedCustomer);
            } else {
                res.status(401).json({ message: 'Not authorized to update this customer' });
            }
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Customer (Admin only)
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (customer) {
            await customer.remove();
            res.json({ message: 'Customer removed' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        // Create a copy of query parameters and exclude pagination/sorting fields
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Convert query object to a string and add MongoDB operators
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

        // Initialize the query with the parsed query string
        let query = Customer.find(JSON.parse(queryStr));

        // Add search functionality if 'search' parameter is present
        if (req.query.search) {
            const searchString = req.query.search;
            query = query.find({
                $or: [
                    { name: { $regex: searchString, $options: 'i' } },
                    { email: { $regex: searchString, $options: 'i' } },
                    { phone: { $regex: searchString, $options: 'i' } }
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
        const customers = await query;
        res.json(customers);
    } catch (error) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: error.message });
    }
};
