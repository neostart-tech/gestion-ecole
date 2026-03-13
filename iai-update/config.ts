export default {
  app_local: true,
  app_dev_url: "http://localhost:8000/api",
  app_prod_url: "https://escen.neostart.tech/api",
  // app_prod_url: "https://new.iai-togo.tg/api",
  app_dev_storage_url: "http://localhost:8000",
  app_prod_storage_url: "https://escen.neostart.tech",
  // app_prod_storage_url: "https://new.iai-togo.tg",
  
  // Configuration Reverb
  reverb: {
    key: "oseylu5sd3axnur0phhu",
    secret: "jvs3oiyffu8ps54px9ii",
    app_id: "196113",
    host: "localhost",
    port: 8080,
    scheme: "http"
  }
} as const;