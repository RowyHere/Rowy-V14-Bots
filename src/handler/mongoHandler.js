const mongoose = require("mongoose");
const config = require("../../config.json")

mongoose.connect(config.mongoose, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

mongoose.connection.on("connected", () => {
  console.log("[+] Mongoose bağlantısı sağlandı!");
});
mongoose.connection.on("error", () => {
  console.error("[-] Mongoose bağlantı hatası!");
});