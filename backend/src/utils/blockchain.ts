import crypto from 'crypto';
import { ethers } from 'ethers';
import { config } from '../config';
import { logger } from './logger';
import { ChainProof } from '../types';

export class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    if (!config.blockchain.useMock && config.blockchain.rpcUrl) {
      this.initializeRealBlockchain();
    }
  }

  private initializeRealBlockchain() {
    try {
      this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
      
      if (config.blockchain.privateKey) {
        this.wallet = new ethers.Wallet(config.blockchain.privateKey, this.provider);
      }

      // Initialize contract if address is provided
      if (config.blockchain.contractAddress && this.wallet) {
        // ABI for simple traceability contract
        const abi = [
          'function recordEvent(string memory dataHash) public returns (uint256)',
          'function verifyEvent(uint256 eventId, string memory dataHash) public view returns (bool)',
          'event EventRecorded(uint256 indexed eventId, string dataHash, address indexed recorder, uint256 timestamp)',
        ];
        
        this.contract = new ethers.Contract(
          config.blockchain.contractAddress,
          abi,
          this.wallet
        );
      }

      logger.info('Real blockchain initialized', { network: config.blockchain.network });
    } catch (error: any) {
      logger.error('Failed to initialize blockchain', error);
      throw error;
    }
  }

  /**
   * Hash event data using SHA-256
   */
  public hashEvent(data: any): string {
    const jsonString = JSON.stringify(data);
    return crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  /**
   * Anchor event to blockchain (real or mock)
   */
  public async anchorToChain(dataHash: string): Promise<ChainProof> {
    if (config.blockchain.useMock) {
      return this.mockAnchorToChain(dataHash);
    }

    return this.realAnchorToChain(dataHash);
  }

  /**
   * Mock blockchain anchoring for development
   */
  private async mockAnchorToChain(dataHash: string): Promise<ChainProof> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const txHash = '0x' + crypto.randomBytes(32).toString('hex');
    const blockNumber = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
    const blockTimestamp = Math.floor(Date.now() / 1000);

    logger.info('Mock blockchain anchor created', { txHash, dataHash });

    return {
      transactionHash: txHash,
      blockNumber,
      blockTimestamp,
      gasUsed: '21000',
      network: 'mock',
    };
  }

  /**
   * Real blockchain anchoring
   */
  private async realAnchorToChain(dataHash: string): Promise<ChainProof> {
    if (!this.contract || !this.wallet) {
      throw new Error('Blockchain not properly initialized');
    }

    try {
      logger.info('Anchoring to real blockchain', { dataHash });

      const tx = await this.contract.recordEvent(dataHash);
      const receipt = await tx.wait();

      logger.info('Blockchain transaction confirmed', {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
      });

      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        blockTimestamp: Math.floor(Date.now() / 1000),
        gasUsed: receipt.gasUsed.toString(),
        network: config.blockchain.network,
      };
    } catch (error: any) {
      logger.error('Failed to anchor to blockchain', error);
      throw error;
    }
  }

  /**
   * Verify event on blockchain
   */
  public async verifyEvent(eventId: number, dataHash: string): Promise<boolean> {
    if (config.blockchain.useMock) {
      // In mock mode, just verify hash format
      return /^[a-f0-9]{64}$/i.test(dataHash);
    }

    if (!this.contract) {
      throw new Error('Blockchain not properly initialized');
    }

    try {
      const isValid = await this.contract.verifyEvent(eventId, dataHash);
      return isValid;
    } catch (error: any) {
      logger.error('Failed to verify event', error);
      return false;
    }
  }

  /**
   * Get transaction details
   */
  public async getTransaction(txHash: string): Promise<any> {
    if (config.blockchain.useMock) {
      return {
        hash: txHash,
        blockNumber: Math.floor(Date.now() / 1000),
        timestamp: Math.floor(Date.now() / 1000),
      };
    }

    if (!this.provider) {
      throw new Error('Blockchain provider not initialized');
    }

    try {
      const tx = await this.provider.getTransaction(txHash);
      return tx;
    } catch (error: any) {
      logger.error('Failed to get transaction', error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
