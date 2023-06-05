import { PORT } from "./src/config/index.js";
import { startServer } from "./src/server.js";
import { connectDB } from "./src/utils/db.js";

async function main() {
  try {
    const server = startServer();

    server.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });

    await connectDB();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
