const {httpserver} = require("./app");

const PORT = process.env.PORT;

httpserver.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
