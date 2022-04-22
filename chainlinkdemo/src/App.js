import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'
import Vault from './abis/Vault.json';
import { useEffect, useState } from 'react';



function App() {


   const [web3,setWeb3] =useState(null)
   const [vaultContract,setVaultContract ]=useState(null)
   const [balanceInContract,setBalanceInContract] =useState(null)
   const [amount, setAmount] = useState(null)

   useEffect(async()=>{
     console.log("useEffect is called")
     loadBlockchainData()
   },[])

   async function loadBlockchainData(){
     console.log("use effet is callled")
     const web3 =new Web3(window.ethereum)
     setWeb3(web3)

     const networkId =await web3.eth.net.getId()

     const vaultContract = new web3.eth.Contract(Vault.abi,Vault.networks[networkId].address)

     console.log("addres of deployed contract", Vault.networks[networkId].address)
     setVaultContract(vaultContract)

     let vaultContractBalance = await vaultContract.methods.balanceOfContract().call()
     setBalanceInContract(vaultContractBalance/1e18)


   }

   async function deposit(){
      await vaultContract.methods.deposit().send({from:"0x3E6ba59EfFa8d6f3f550287F33b3E6C250C83af0",value:amount.toString()})
      let vaultContractBalance = await vaultContract.methods.balanceOfContract().call()
      console.log("v1 balnace = ",vaultContractBalance.toString())
   }

   function amountChanged(e){
     setAmount(e.target.value * 1e18)

   }

  return (
    <div >
       <h1>Vault app</h1>
       <br />
       <input type="text" placeholder='amount in eth' onChange={amountChanged}  />
       <br />
       <button onClick={deposit}>存款</button>

       <br />
       <span>Balance in Contract : </span><h3>{balanceInContract} ether</h3>
    </div>  
  );
}

export default App;
