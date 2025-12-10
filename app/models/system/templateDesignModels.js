const mongoose = require('mongoose');

const templateDesignSchema = new mongoose.Schema({
  name: { type: String  },
  design: { type: Object },
  type: { type: String,
    enum: ['landingPage'],
    default: 'landingPage'
   },
  status: { type: String,
    enum: ['published', 'archived'],
    default: 'published'
   },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const TemplateDesign = mongoose.model('TemplateDesign', templateDesignSchema);

module.exports = TemplateDesign;