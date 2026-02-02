import { createClient, createAccount } from 'genlayer-js';
import { testnetAsimov } from 'genlayer-js/chains';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  // Create account for deployment
  const account = createAccount();
  
  console.log('🚀 Deploying Truth Oracle Contract...');
  console.log('📝 Deployer address:', account.address);

  // Create client
  const client = createClient({
    chain: testnetAsimov,
    account: account
  });

  // Read contract code
  const contractPath = path.join(__dirname, '../contracts/truth_oracle.py');
  const contractCode = fs.readFileSync(contractPath, 'utf8');

  try {
    // Deploy contract
    const txHash = await client.deployContract({
      account: account,
      code: contractCode,
      constructorArgs: []
    });

    console.log('✅ Contract deployed!');
    console.log('📋 Transaction hash:', txHash);

    // Wait for receipt
    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      status: 'FINALIZED'
    });

    const contractAddress = receipt.contractAddress;
    console.log('🎉 Contract address:', contractAddress);

    // Save contract address
    const addressPath = path.join(__dirname, '../Contractaddress.txt');
    fs.writeFileSync(addressPath, `"${contractAddress}"`);
    console.log('💾 Contract address saved to Contractaddress.txt');

    // Also save to .env for frontend
    const envPath = path.join(__dirname, '../frontend/.env');
    const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\nNEXT_PUBLIC_GENLAYER_RPC_URL=https://testnet-rpc.genlayer.com/api\n`;
    fs.writeFileSync(envPath, envContent);
    console.log('💾 Environment variables saved to frontend/.env');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

main();
