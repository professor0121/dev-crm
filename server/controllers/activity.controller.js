const Activity = require('../models/activity.model');

// Get All Activities (Admin and employee)
exports.getAllActivities = async (req, res) => {
    try {
        // Create a copy of query parameters and exclude pagination/sorting fields
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Convert query object to a string and add MongoDB operators
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, match => `$${match}`);

        // Initialize the query with the parsed query string
        let query = Activity.find(JSON.parse(queryStr)).populate('employee', 'name email');

        // Add search functionality if 'search' parameter is present
        if (req.query.search) {
            const searchString = req.query.search;
            query = query.find({
                $or: [
                    { type: { $regex: searchString, $options: 'i' } },
                    { description: { $regex: searchString, $options: 'i' } },
                    { location: { $regex: searchString, $options: 'i' } }
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
        const activities = await query;
        res.json(activities);
    } catch (error) {
        // Handle any errors that occur during the query
        res.status(500).json({ message: error.message });
    }
};


// Get Activity by ID (Admin and assigned employee)
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id).populate('employee', 'name email');

        if (activity) {
            if (req.user.role === 'admin' || activity.employee._id.toString() === req.user._id.toString()) {
                res.json(activity);
            } else {
                res.status(401).json({ message: 'Not authorized to access this activity' });
            }
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Activity (Admin and employee)
exports.addActivity = async (req, res) => {
    const { employee, type, description, date, time, location, duration, participants } = req.body;

    try {
        const activity = new Activity({
            employee,
            type,
            description,
            date,
            time,
            location,
            duration,
            participants
        });

        const createdActivity = await activity.save();
        res.status(201).json(createdActivity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Activity (Admin and assigned employee)
exports.updateActivity = async (req, res) => {
    const { employee, type, description, date, time, location, duration, participants } = req.body;

    try {
        const activity = await Activity.findById(req.params.id);

        if (activity) {
            if (req.user.role === 'admin' || activity.employee._id.toString() === req.user._id.toString()) {
                activity.employee = employee || activity.employee;
                activity.type = type || activity.type;
                activity.description = description || activity.description;
                activity.date = date || activity.date;
                activity.time = time || activity.time;
                activity.location = location || activity.location;
                activity.duration = duration || activity.duration;
                activity.participants = participants || activity.participants;

                const updatedActivity = await activity.save();
                res.json(updatedActivity);
            } else {
                res.status(401).json({ message: 'Not authorized to update this activity' });
            }
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Activity (Admin only)
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (activity) {
            await activity.remove();
            res.json({ message: 'Activity removed' });
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
