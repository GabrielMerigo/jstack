const http = require("http");
const routes = require("./routes");
const url = require("url");
const bodyParser = require("./helpers/bodyParser");

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);

  let { pathname } = parsedUrl;

  const splitEndpoint = pathname.split("/").filter(Boolean);
  let id = null;

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find(
    (routeObj) =>
      routeObj.endpoint === pathname && routeObj.method === request.method
  );

  if (route) {
    request.query = parsedUrl.query;
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, {
        "Content-Type": "text/html",
      });
      response.end(JSON.stringify(body));
    };

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      bodyParser(request, () => route.handler(request, response));
    } else {
      route.handler(request, response);
    }
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(`Cannot ${request.method} ${request.url}`);
  }
});

server.listen(3000, () => console.log("Server Started"));
