const { Rating, Store, User, sequelize } = require('../models');

const submitRating = async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { userId, storeId }
    });

    let ratingRecord;
    if (existingRating) {
      // Update existing rating
      await existingRating.update({ rating, comment });
      ratingRecord = existingRating;
    } else {
      // Create new rating
      ratingRecord = await Rating.create({
        userId,
        storeId,
        rating,
        comment
      });
    }

    // Update store's average rating
    await updateStoreAverageRating(storeId);

    const createdRating = await Rating.findByPk(ratingRecord.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      rating: createdRating
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;

    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address', 'averageRating']
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
    console.error('Get user ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOne({
      where: { id, userId }
    });

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    const storeId = rating.storeId;
    await rating.destroy();

    // Update store's average rating
    await updateStoreAverageRating(storeId);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStoreAverageRating = async (storeId) => {
  try {
    const result = await Rating.findOne({
      where: { storeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('rating')), 'totalRatings']
      ],
      raw: true
    });

    const averageRating = parseFloat(result.averageRating) || 0;
    const totalRatings = parseInt(result.totalRatings) || 0;

    await Store.update(
      { averageRating, totalRatings },
      { where: { id: storeId } }
    );
  } catch (error) {
    console.error('Update store average rating error:', error);
  }
};

module.exports = {
  submitRating,
  getUserRatings,
  deleteRating
};
