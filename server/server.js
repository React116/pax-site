// ... Diğer importların yanına:
const calendarRoutes = require('./routes/calendarRoutes');

// ... app.use tanımlarının olduğu yere:
app.use('/api/calendar', calendarRoutes);