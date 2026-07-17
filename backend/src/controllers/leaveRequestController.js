const LeaveRequest = require('../models/LeaveRequest');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const getTeamUserIds = require('../utils/getTeamUserIds');
const { getPagination } = require('../utils/paginate');

const createLeaveRequest = catchAsync(async (req, res) => {
    const { type, startDate, endDate } = req.body;

    if (!type || !startDate || !endDate) {
        throw new AppError('VALIDATION_ERROR', 400, 'Faltan campos obligatorios');
    }

    if (new Date(endDate) < new Date(startDate)) {
        throw new AppError('VALIDATION_ERROR', 400, 'La fecha de fin no puede ser anterior a la de inicio');
    }

    const request = await LeaveRequest.create({
        companyId: req.companyId,
        userId: req.user.id,
        type,
        startDate,
        endDate,
    });
    res.status(201).json({ success: true, data: request });
});

const listMyRequests = catchAsync(async (req, res) => {
    const { page, limit, skip } = getPagination(req);
    const filter = { userId: req.user.id, companyId: req.companyId };
    if (req.query.status) filter.status = req.query.status;

    const [ requests, total ] = await Promise.all([
        LeaveRequest.find(filter).sort({ createAt: -1 }).skip(skip).limit(limit),
        LeaveRequest.countDocuments(filter),
    ]);

    res.status(200).json({
        success: true,
        data: requests,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
});

const listTeamRequests = catchAsync(async (req, res) => {
    const { page, limit, skip } = getPagination(req);
    const teamIds = await getTeamUserIds(req);

    const filter = { companyId: req.companyId, userId: { $in: teamIds} };
    if (req.query.status) filter.status = req.query.status;

    const [requests, total] = await Promise.all([
        LeaveRequest.find(filter).populate('userId', 'name email').sort({ createAt: -1 }).skip(skip).limit(limit),
        LeaveRequest.countDocuments(filter),
    ]);
    res.status(200).json({
        success: true,
        data: requests,
        meta: { page, limit, total, totalPages: Math.ceil( total/ limit) },
    });
});

async function resolveRequest(req, status) {
    const teamIds = await getTeamUserIds(req);

    const request = await LeaveRequest.findOne({
        _id: req.params.id,
        companyId: req.companyId,
        userId: { $in: teamIds },
    });

    if (!request) { 
        throw new AppError('NOT_FOUND', 404, 'Solicitud no encontrada');
    }

    if (request.status !== 'pending') {
        throw new AppError('INVALID_STATE', 409, `Esta solicitud ya está ${request.status}`);
    }

    request.status = status;
    request.approvedBy = req.user.id;
    await request.save();

    return request;
}

const approveRequest = catchAsync(async (req, res) => {
    const request = await resolveRequest(req, 'approved');
    res.status(200).json({ success: true, data: request });
});

const rejectRequest = catchAsync(async (req, res) => {
    const request = await resolveRequest(req, 'rejected');
    res.status(200).json({ success: true, data: request });
});

module.exports = {
    createLeaveRequest,
    listMyRequests,
    listTeamRequests,
    approveRequest,
    rejectRequest, 
};