const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const timeEntryRoutes = require('./routes/timeEntryRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');
const companyRoutes = require('./routes/companyRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Demasiados intentos, prueba mas tarde'},
    },
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, data: { status: 'ok' } });
})

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/time-entries', timeEntryRoutes);
app.use('/api/v1/leave-requests', leaveRequestRoutes);
app.use('/api/v1/companies', companyRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;