'use strict';
/**

*Start the network using composer api !
Pre-Reqs
* 1. Fabric has to be running 
* 2. Peer admin card and network admin card imported to the card storage on file system

 * 1. Create the Admin Connection instance
 * 2. Connect
 * 3. Create the Business Network Definition Object
 * 4. Install network to fabric dev env
 * 5. Start the network 
 * 6. connect network admin card
 * 7. Ping the network 
 * 8. Disconnect 
 */
const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;

// Network details 

const cardNameForPeerAdmin = "PeerAdmin@hlfv1";
const  cardNameForNetworkAdmin   = "admin@airlinev8";
 const appName = "NAME"; //<-- Put name of your network
 const bnaDirectory = "PATH"  //<-- Put path to your network folder
 const version = "0.0.4"  // <-- Put version of your network 



// 1. Create the AdminConnection instance

var walletType = { type: 'composer-wallet-filesystem' }
const adminConnection = new AdminConnection(walletType);

// 2. Connect using the card for the Network Admin
return adminConnection.connect(cardNameForPeerAdmin).then(function(){
    console.log("Admin Connection Successful!!!");

    // Upgrade the BNA version
    upgradeApp();
}).catch(function(error){
    console.log(error);
});

/**
 * Deploys a network app using the admin connection
 */
function upgradeApp(){
    // 3. Create a Business Network Definition object from directory
    var bnaDef = {}
    BusinessNetworkDefinition.fromDirectory(bnaDirectory).then(function(definition){
        bnaDef = definition;
        console.log("Successfully created the definition!!! ",bnaDef.getName())

        // 4.Install the new version of the BNA
        return adminConnection.install(bnaDef);
        
    }).then(()=>{

        // 5. start the network 
        // If you do not have the app installed, you will get an error
        console.log("Install successful")
        return adminConnection.start(appName, version, 
            { networkAdmins:
                [ {userName : 'admin', enrollmentSecret:'adminpw'} ]
            }
            )
            

    }).then(()=>{
        console.log('Network up and runing!!! ', 'Network name: ', bnaDef.getName(),'  ', 'Network version: ', bnaDef.getVersion());
         //6. connect network admin card 
         adminConnection.connect(cardNameForNetworkAdmin).then(()=>{
             // 7. Ping the network 
            adminConnection.ping(appName).then(function(response){
                console.log("Ping Response:");
                console.log(response);
            });
         })
         
            
        // 8. Disconnect
        adminConnection.disconnect();
        

    }).catch(function(error){
        console.log(error);
    });

}

