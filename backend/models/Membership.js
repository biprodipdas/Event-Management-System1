const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  membershipNumber: {
    type: String,
    required: true,
    unique: true
  },
  memberName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  membershipType: {
    type: String,
    enum: ['6months', '1year', '2years'],
    required: true,
    default: '6months'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to calculate end date
membershipSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('membershipType')) {
    const start = new Date(this.startDate);
    const end = new Date(start);
    
    switch(this.membershipType) {
      case '6months':
        end.setMonth(end.getMonth() + 6);
        break;
      case '1year':
        end.setFullYear(end.getFullYear() + 1);
        break;
      case '2years':
        end.setFullYear(end.getFullYear() + 2);
        break;
    }
    
    this.endDate = end;
  }
  
  this.updatedAt = Date.now();
  next();
});

// Auto-generate membership number
membershipSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.membershipNumber = `MEM${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Membership', membershipSchema);
