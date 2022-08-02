module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 8545,
               network_id: "*" // Match any network id
          },
          chainskills:{
            host: "localhost",
            port: 8546,
            network_id: "4224",
            gas: 4700000,
            from:  '0xe1dbbf219627d7389b9654926ac7da36d0a47f84'
          }
     }
};
