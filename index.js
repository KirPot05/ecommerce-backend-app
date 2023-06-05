import { PORT } from "./src/config/index.js";
import { startServer } from "./src/server.js";

const server = startServer();

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
