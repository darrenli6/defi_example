require("babel-register") 
require("babel-polyfill")

module.exports = {
 

  networks: {
   
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    
  },
 
  
  compilers: {
    solc: {
      version: "0.8.9",  
      // 优化
      optimizer:{
        enable:true,
        runs: 200    // 优化次数
      } 
     
    }
  },

 
 
};
