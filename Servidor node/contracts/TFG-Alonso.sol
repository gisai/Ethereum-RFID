pragma solidity ^0.4.0;

contract TFGAlonso {
    
    struct Mercancia {
        string lector;
        address quien;
        string ID;
    }
    Mercancia[9] mercancia;
    
    string hola="hola1234";
    address private owner;
    address[10] private clientes;
    uint  i;
    uint cli;
    
    
    modifier onlyOwner {
        require (owner == msg.sender);
                _;
            }
    modifier onlyCliente{
        bool contains =false;
        
        for (uint c=0; c< clientes.length; c++){
            if (clientes[c]==msg.sender){
                contains=true;
            }
        }
        require(contains);
        _;
    }     
    
     constructor ()public{
        owner=msg.sender;
        clientes[0]=owner;
        i=0;
        cli=1;
    }
    
    function setClientes (address direccion) public onlyOwner{
        clientes[cli]=direccion;
        cli++;
    }
    
   function findCliente (address direccion)public onlyOwner returns (string)  {
        for (uint c=1; c< clientes.length; c++){
            if (clientes[c]== direccion){
                return "si";
            } 
        }
        return "no";
    }
    
    function setID(string ID_arduino, string lector_arduino) public {
       mercancia[i].ID=ID_arduino;
      mercancia[i].lector=lector_arduino;
       mercancia[i].quien=msg.sender;
        i++;
    }
    
    
    
    function getInfo (string q) public onlyCliente returns  (address){
      for(uint p; p<9;p++){
          if(keccak256(mercancia[p].ID)==keccak256(q)) {
              return mercancia[p].quien;
          }
      }
        
                
            }
        
    
}