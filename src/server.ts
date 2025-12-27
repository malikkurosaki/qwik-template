import Elysia from "elysia";
import ApiApp from "./api";
const PORT = Bun.env.PORT || 3000;

new Elysia()
    .use(ApiApp)
    .listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });