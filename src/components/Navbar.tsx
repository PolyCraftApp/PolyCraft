import React from 'react';
import { WalletMultiButton } from './WalletProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import logo from '/assets/maillogor.png';
import pumpIcon from '/assets/pump.png';

interface NavbarProps {
  onNavClick: (page: string) => void;
  onCopyCA: () => void;
  contractAddress: string;
  onShowToast: (message: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, onCopyCA, contractAddress, onShowToast }) => {
  const { connected } = useWallet();

  const handleCreateClick = () => {
    if (!connected) {
      onShowToast('Please connect your wallet to create predictions');
      return;
    }
    onNavClick('create');
  };

  const handlePumpFunClick = (e: React.MouseEvent) => {
    if (!contractAddress) {
      e.preventDefault();
      onShowToast('🚀 Token will be launched soon!');
    }
  };

  const pumpFunHref = contractAddress ? `https://pump.fun/coin/${contractAddress}` : '#';
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavClick('home')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <img src={logo} alt="PolyCraft Logo" width="64" height="64" />
          </div>
          <span className="brand-name">PolyCraft</span>
        </div>
        <div className="navbar-nav">
          <button className="nav-link" onClick={() => onNavClick('home')}>Home</button>
          <button 
            className={`nav-link ${!connected ? 'disabled' : ''}`}
            onClick={handleCreateClick}
            title={!connected ? 'Connect wallet to create predictions' : ''}
          >
            Create Prediction
          </button>
          <button className="nav-link" onClick={() => onNavClick('docs')}>Docs</button>
        </div>
            <div className="navbar-actions">
              <div className="social-links">
            <a href="https://github.com/PolyCraftApp/PolyCraft/" target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://x.com/PolyCraftApp" target="_blank" rel="noopener noreferrer" className="social-link" title="X (Twitter)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href={pumpFunHref} target="_blank" rel="noopener noreferrer" className={`social-link ${!contractAddress ? 'disabled' : ''}`} title={contractAddress ? "Pump.fun" : "Token will be launched soon"} onClick={handlePumpFunClick}>
                  <img src={pumpIcon} alt="Pump.fun" width="20" height="20" />
                </a>
              </div>
              <div className="navbar-ca" onClick={onCopyCA} title={contractAddress ? "Click to copy contract address" : "Contract address not available yet"}>
                <span className="ca-label">CA:</span>
                <span className={`ca-address ${!contractAddress ? 'ca-placeholder' : ''}`}>
                  &nbsp;
                  {contractAddress ? 
                    (contractAddress.length > 10 ? `${contractAddress.slice(0, 4)}...${contractAddress.slice(-4)}` : contractAddress) :
                    "Will be added soon"
                  }
                </span>
              </div>
              <WalletMultiButton />
            </div>
      </div>
    </nav>
  );
};

export default Navbar;
