const Marquee = require('../modals/marqueeModal');

// Get all Marquee
exports.getAllMarquee = async (req, res) => {
  try {
    const MarqueeList = await Marquee.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(MarqueeList);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get Marquee overview (limited fields)
exports.getMarqueeOverview = async (req, res) => {
  try {
    const marqueeOverview = await Marquee.findAll({
      attributes: ['id', 'title','link','createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(marqueeOverview);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get single Marquee by ID
exports.getMarqueeById = async (req, res) => {
  try {
    const marquee = await Marquee.findByPk(req.params.id); 
    if (marquee) {
      res.json(marquee);
    } else {
      res.status(404).send('Marquee not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create new Marquee
exports.createMarquee = async (req, res) => {
  try {
    const { title,link } = req.body;
    if (!title || !link) {
      return res.status(400).json({
        error: 'Required fields missing. Title and link are required.'
      });
    }
    const newMarquee = await Marquee.create({
      title,
      link
    });

    res.status(201).json(newMarquee);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update Marquee by ID
exports.updateMarquee = async (req, res) => {
  try {
    const marqueeId = req.params.id;
    const { title, link } = req.body;

    const marqueeItems = await Marquee.findByPk(marqueeId);
    
    if (!marqueeItems) {
      return res.status(404).json({
        error: 'Marquee not found'
      });
    }

    // Update only provided fields
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (link !== undefined) updates.link = link;

    await marqueeItems.update(updates);

    // Fetch and return the updated Marquee
    const updatedMarquee = await Marquee.findByPk(marqueeId);
    res.json(updatedMarquee);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete Marquee by ID
exports.deleteMarquee = async (req, res) => {
  try {
    const marqueeId = req.params.id;
    const marqueeItems = await Marquee.findByPk(marqueeId);
    
    if (!marqueeItems) {
      return res.status(404).json({
        error: 'Marquee not found'
      });
    }

    await marqueeItems.destroy();
    res.json({
      message: 'Marquee deleted successfully',
      deletedId: marqueeId
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};