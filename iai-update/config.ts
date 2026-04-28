const isLocal = true; 
export default {
  app_local: isLocal,
  app_dev_url: "http://localhost:8000/api",
  app_prod_url: "https://escen.neostart.tech/api",
  
  app_dev_storage_url: "http://localhost:8000",
  app_prod_storage_url: "https://escen.neostart.tech",
  
  // Configuration Reverb Dynamique
  reverb: {
    key: "oseylu5sd3axnur0phhu",
    secret: "jvs3oiyffu8ps54px9ii",
    app_id: "196113",
    host: isLocal ? "127.0.0.1" : "escen.neostart.tech",
    port: isLocal ? 8080 : 443,
    scheme: isLocal ? "http" : "https"
  }
} as const;