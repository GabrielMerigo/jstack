const http = require("http");
const UserController = require("./controller/UserController");
const routes = require("./routes");

const server = http.createServer((request, response) => {
  const routes = routes.find((routeObj) => routeObj.endpoint === Re);
});

server.listen(3000, () => console.log("Server Started"));
