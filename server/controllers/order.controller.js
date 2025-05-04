const Order = require('../models/order.model');
const OrderDetail = require('../models/orderdetails.model');

// Get All Orders (Admin only)
exports.getAllOrders = async (req, res) => {
    try {
        // Create a copy of query parameters and exclude pagination/sorting fields
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Convert query object to a string and add MongoDB operators
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

        // Initialize the query with the parsed query string
        let query = Order.find(JSON.parse(queryStr)).populate('customer', 'name email');

        // Add search functionality if 'search' parameter is present
        if (req.query.search) {
            const searchString = req.query.search;
            query = query.find({
                $or: [
                    { status: { $regex: searchString, $options: 'i' } },
                    { paymentMethod: { $regex: searchString, $options: 'i' } }
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
        const orders = await query;
        res.json(orders);
    } catch (error) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: error.message });
    }
};

// Get Order by ID (Admin and assigned employee)
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer', 'name email');

        if (order) {
            if (req.user.role === 'admin' || order.customer.employee.toString() === req.user._id.toString()) {
                res.json(order);
            } else {
                res.status(401).json({ message: 'Not authorized to access this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Order (Admin and assigned employee)
exports.addOrder = async (req, res) => {
    const { customer, orderDate, totalAmount, status, paymentMethod, shippingAddress, orderDetails } = req.body;

    try {
        const order = new Order({
            customer,
            orderDate,
            totalAmount,
            status,
            paymentMethod,
            shippingAddress
        });

        const createdOrder = await order.save();

        for (const detail of orderDetails) {
            const orderDetail = new OrderDetail({
                order: createdOrder._id,
                product: detail.product,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                subtotal: detail.subtotal,
                discount: detail.discount
            });
            await orderDetail.save();
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Order (Admin and assigned employee)
exports.updateOrder = async (req, res) => {
    const { customer, orderDate, totalAmount, status, paymentMethod, shippingAddress } = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (req.user.role === 'admin' || order.customer.employee.toString() === req.user._id.toString()) {
                order.customer = customer || order.customer;
                order.orderDate = orderDate || order.orderDate;
                order.totalAmount = totalAmount || order.totalAmount;
                order.status = status || order.status;
                order.paymentMethod = paymentMethod || order.paymentMethod;
                order.shippingAddress = shippingAddress || order.shippingAddress;

                const updatedOrder = await order.save();
                res.json(updatedOrder);
            } else {
                res.status(401).json({ message: 'Not authorized to update this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Order (Admin only)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await OrderDetail.deleteMany({ order: order._id });
            await order.remove();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
