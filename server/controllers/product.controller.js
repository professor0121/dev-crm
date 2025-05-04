const Product = require('../models/product.model');

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        // Create a copy of query parameters and exclude pagination/sorting fields
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Convert query object to a string and add MongoDB operators
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

        // Initialize the query with the parsed query string
        let query = Product.find(JSON.parse(queryStr));

        // Add search functionality if 'search' parameter is present
        if (req.query.search) {
            const searchString = req.query.search;
            query = query.find({
                $or: [
                    { name: { $regex: searchString, $options: 'i' } },
                    { description: { $regex: searchString, $options: 'i' } },
                    { category: { $regex: searchString, $options: 'i' } },
                    { brand: { $regex: searchString, $options: 'i' } }
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
        const products = await query;
        res.json(products);
    } catch (error) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: error.message });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Product (Admin only)
exports.addProduct = async (req, res) => {
    const { name, description, price, category, brand, quantityInStock } = req.body;

    try {
        const product = new Product({
            name,
            description,
            price,
            category,
            brand,
            quantityInStock
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Product (Admin only)
exports.updateProduct = async (req, res) => {
    const { name, description, price, category, brand, quantityInStock } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.quantityInStock = quantityInStock || product.quantityInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.remove();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
