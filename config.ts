const isLocal = false; 
export default {
  app_local: isLocal,
  app_dev_url: "http://localhost:8000/api",
  // app_dev_url: "http://192.168.10.105:8000/api",
  // app_prod_url: "https://escen.neostart.tech/api",
  app_prod_url: "https://new.iai-togo.tg/api",


  
  
  app_dev_storage_url: "http://localhost:8000",
  // app_prod_storage_url: "https://escen.neostart.tech",
   app_prod_storage_url: "https://new.iai-togo.tg",


  // Configuration Reverb Dynamique
  reverb: {
    key: "oseylu5sd3axnur0phhu",
    secret: "jvs3oiyffu8ps54px9ii",
    app_id: "196113",
    // host: isLocal ? "127.0.0.1" : "escen.neostart.tech",
        host: isLocal ? "127.0.0.1" : "https://new.iai-togo.tg",

    port: isLocal ? 8080 : 443,
    scheme: isLocal ? "http" : "https"
  }
} as const;