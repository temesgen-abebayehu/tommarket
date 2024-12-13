import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
    const { name, price, description, category, countInStock, imageUrl } = req.body;

    try {
        const { user } = req;
        if (user.role !== 'seller') {
            return res.status(401).json({ message: 'Not authorized, only sellers can create products' });
        }

        const product = new Product({ owner: user, name, price, description, category, countInStock, imageUrl });
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        console.error('Error on createProduct:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});

        res.json(products);
    } catch (error) {
        console.error('Error on getProducts:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById({ _id: id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    }
    catch (error) {
        console.error('Error on getProduct:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { user } = req;
        if (user._id.toString() !== product.owner.toString()) {
            return res.status(401).json({ message: 'Not authorized, you can only update your own products' });
        }

        Object.keys(updates).forEach(key => {
            product[key] = updates[key];
        });

        await product.save();

        res.json(product);
    } catch (error) {
        console.error('Error on updateProduct:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findByIdAndDelete( id );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { user } = req;
        if (user._id.toString() !== product.owner.toString()) {
            return res.status(401).json({ message: 'Not authorized, you can only update your own products' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error on deleteProduct:', error.message);
        res.status(500).json({ message: error.message });
    }
};