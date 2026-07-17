const User = require('../models/User');

async function getTeamUserIds(req) {
  if (req.user.role === 'companyAdmin') {
    const users = await User.find({ companyId: req.companyId }).select('_id');
    return users.map((u) => u._id);
  }
  const users = await User.find({ companyId: req.companyId, managerId: req.user.id }).select('_id');
  return users.map((u) => u._id);
}

module.exports = getTeamUserIds;