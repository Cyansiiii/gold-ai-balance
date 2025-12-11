import os
import time
import json
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Configuration
RPC_URL = "https://rpc-testnet.qie.digital" # Check docs
PRIVATE_KEY = os.getenv("AGENT_PRIVATE_KEY")
VAULT_ADDRESS = "0x..." # Address from Phase 2 deployment
# Copy ABI from artifacts/contracts/AurumVault.sol/AurumVault.json
CONTRACT_ABI = json.loads('[...]') 

web3 = Web3(Web3.HTTPProvider(RPC_URL))
account = web3.eth.account.from_key(PRIVATE_KEY)
contract = web3.eth.contract(address=VAULT_ADDRESS, abi=CONTRACT_ABI)

def get_market_sentiment():
    # SIMULATION LOGIC FOR DEMO
    # In production, fetch real prices from QIE Oracle or external API
    # Here we toggle every 2 minutes for the video demo
    timestamp = int(time.time())
    if timestamp % 120 < 60:
        return "RISK_ON"
    else:
        return "RISK_OFF"

def rebalance(to_stable):
    print(f"Executing Rebalance: To Stable? {to_stable}")
    nonce = web3.eth.get_transaction_count(account.address)
    
    # Build Transaction
    tx = contract.functions.executeRebalance(to_stable).build_transaction({
        'chainId': 209,
        'gas': 2000000,
        'gasPrice': web3.to_wei('1', 'gwei'),
        'nonce': nonce,
    })
    
    # Sign & Send
    signed_tx = web3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print(f"Tx Sent! Hash: {web3.to_hex(tx_hash)}")
    
    # Wait for 3-second finality
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print("Confirmed in Block:", receipt.blockNumber)

def main():
    print("Aurum AI Agent Started...")
    current_state = "RISK_ON" # Assuming vault starts in QIE
    
    while True:
        market = get_market_sentiment()
        print(f"Market Sentiment: {market}")
        
        if market == "RISK_OFF" and current_state == "RISK_ON":
            rebalance(to_stable=True)
            current_state = "RISK_OFF"
            
        elif market == "RISK_ON" and current_state == "RISK_OFF":
            rebalance(to_stable=False)
            current_state = "RISK_ON"
            
        time.sleep(10) # Check every 10 seconds

if __name__ == "__main__":
    main()
