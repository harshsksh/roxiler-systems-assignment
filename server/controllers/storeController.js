const { Store, User, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

const getAllStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      whereClause[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('Store.name')), { [Op.like]: `%${searchTerm}%` }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('Store.address')), { [Op.like]: `%${searchTerm}%` })
      ];
    }
    
    const { count, rows: stores } = await Store.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      stores,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stores',
      message: error.message || 'Internal server error'
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const store = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    let userRating = null;
    if (userId) {
      const rating = await Rating.findOne({
        where: { userId, storeId: id }
      });
      userRating = rating ? rating.rating : null;
    }

    res.json({
      store: {
        ...store.toJSON(),
        userRating
      }
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ error: 'Store with this email already exists' });
    }

    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId
    });

    if (owner.role !== 'system_admin') {
      await owner.update({ 
        role: 'store_owner',
        isStoreOwner: true 
      });
    } else {
      await owner.update({ 
        isStoreOwner: true 
      });
    }

    const createdStore = await Store.findByPk(store.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Store created successfully',
      store: createdStore
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (email && email !== store.email) {
      const existingStore = await Store.findOne({ where: { email } });
      if (existingStore) {
        return res.status(400).json({ error: 'Store with this email already exists' });
      }
    }

    await store.update({ name, email, address, ownerId });

    const updatedStore = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      message: 'Store updated successfully',
      store: updatedStore
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    await store.destroy();

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: { storeId: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'address']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      ratings,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRatings
};
