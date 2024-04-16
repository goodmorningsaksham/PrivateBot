import app from './app.js';
import { connectDB } from './db/connection.js';
// connections & listeners
const PORT = process.env.PORT || 5000;
connectDB()
    .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${process.env.PORT} and Connected to Database`));
})
    .catch((error) => console.log(error));
//# sourceMappingURL=index.js.map