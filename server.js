const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/db/db");
const setupSocketServer = require("./src/socket/socket.server");

const httpServer = http.createServer(app);

// Setup socket.io on the HTTP server
setupSocketServer(httpServer);

// Connect to DB
connectDB();

// Start HTTP server (not app.listen!)
httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
