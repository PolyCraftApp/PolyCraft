import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import './App.css'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Docs from './components/Docs'
import CreatePredictionForm from './components/CreatePredictionForm'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism-tomorrow.css'
const logo = '/assets/maillogor.png'
const pumpIcon = '/assets/pump.png'

function App() {
  const [toast, setToast] = useState({ message: '', isVisible: false });
  const [currentPage, setCurrentPage] = useState('home');
  const [contractAddress, setContractAddress] = useState('');

  const { connected } = useWallet()

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
  };

  // Check wallet connection when trying to open create page
  useEffect(() => {
    if (currentPage === 'create' && !connected) {
      setCurrentPage('home')
      setToast({ message: 'Please connect your wallet to create predictions', isVisible: true })
    }
  }, [currentPage, connected])

  const hideToast = () => {
    setToast({ message: '', isVisible: false });
  };

  const handleViewDocs = () => {
    setCurrentPage('docs');
  };

  const handleStartCreatingMarkets = async () => {
    if (!connected) {
      // Show wallet connection modal via programmatic click
      const walletButton = document.querySelector('.wallet-adapter-button') as HTMLElement;
      if (walletButton) {
        walletButton.click();
      }
      return;
    }
    setCurrentPage('create');
  };

  const handleConnectWalletAndStart = async () => {
    if (!connected) {
      // Show wallet connection modal via programmatic click
      const walletButton = document.querySelector('.wallet-adapter-button') as HTMLElement;
      if (walletButton) {
        walletButton.click();
      }
      return;
    }
    setCurrentPage('create');
  };

  const handleCopyCA = async () => {
    if (!contractAddress) {
      showToast('Contract address not available yet');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(contractAddress);
      showToast('Contract address copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy address');
    }
  };

  const fetchContractAddress = async () => {
    try {
      const response = await fetch('/api/ca');
      const data = await response.json();
      
      if (data.success && data.ca) {
        setContractAddress(data.ca);
      } else {
        console.error('Failed to fetch contract address:', data.error);
      }
    } catch (error) {
      console.error('Error fetching contract address:', error);
    }
  };

  const handlePumpFunClick = (e: React.MouseEvent) => {
    if (!contractAddress) {
      e.preventDefault();
      showToast('🚀 Token will be released soon!');
    }
  };

  const pumpFunHref = contractAddress ? `https://pump.fun/coin/${contractAddress}` : '#';

  // Handle navigation
  const handleNavClick = (page: string) => {
    setCurrentPage(page);
  };

  // Highlight code when component mounts
  useEffect(() => {
    Prism.highlightAll();
  }, [currentPage]);

  // Fetch contract address on component mount
  useEffect(() => {
    fetchContractAddress();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'docs':
        return <Docs />;
      case 'create':
        return (
          <main className="main-content">
            <div className="create-page-header">
              <div className="container">
                <h1>Create Your Prediction Market</h1>
                <p>Create custom prediction markets with Python-like code.</p>
              </div>
            </div>

            <section className="market-example-section">
              <div className="container">
                <CreatePredictionForm />
              </div>
            </section>
          </main>
        );
      default:
        return (
          <main className="main-content">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-glow" aria-hidden="true" />
              <div className="hero-content">
                <div className="hero-badge">
                  <span className="hero-badge-dot" aria-hidden="true" />
                  Built on Solana
                </div>
                <h1 className="hero-title">
                  Create Your Own
                  <span className="hero-title-accent">Prediction Markets</span>
                </h1>
                <p className="hero-subtitle">
                  Build custom betting events with Python-like prediction code.{' '}
                  <strong>Anyone can create markets</strong>, write simple logic, and let the code decide outcomes automatically.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={handleStartCreatingMarkets}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Start Creating Markets
                  </button>
                  <button className="btn-secondary" onClick={handleViewDocs}>View Docs</button>
                </div>
                <div className="hero-stats" aria-label="Platform statistics">
                  <div className="hero-stat">
                    <span className="hero-stat-value">12,400+</span>
                    <span className="hero-stat-label">Markets Created</span>
                  </div>
                  <div className="hero-stat-divider" aria-hidden="true" />
                  <div className="hero-stat">
                    <span className="hero-stat-value">$4.2M</span>
                    <span className="hero-stat-label">Total Volume</span>
                  </div>
                  <div className="hero-stat-divider" aria-hidden="true" />
                  <div className="hero-stat">
                    <span className="hero-stat-value">38,900</span>
                    <span className="hero-stat-label">Open Positions</span>
                  </div>
                </div>
              </div>
            </section>

                {/* Live Market Example Section */}
                <section className="market-example-section">
          <div className="container">
            <h2 className="section-title">Live Market Example</h2>
            <div className="market-card">
              <div className="market-header">
                <div className="market-creator">
                  <div className="creator-avatar" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <div className="creator-info">
                    <span className="creator-name">CryptoBoss751</span>
                    <span className="creator-ca" onClick={handleCopyCA} title="Click to copy contract address">7xK9...mN2P</span>
                  </div>
                </div>
                <div className="market-status">
                      <span className="status-badge active">Live</span>
                      <span className="creation-date">Created Mar 2, 2026</span>
                </div>
              </div>
              
              <div className="market-content">
                <h3 className="market-title">Will Bitcoin reach $200,000 by December 31, 2026?</h3>
                <p className="market-description">
                  This market resolves to YES if Bitcoin (BTC) reaches or exceeds $200,000 USD on any major exchange
                  (Coinbase, Binance, Kraken) by December 31, 2026 at 11:59 PM UTC. Price data will be sourced from
                  CoinGecko's aggregated price feed.
                </p>

                <div className="market-stats">
                  <div className="stat">
                    <span className="stat-label">Open Positions</span>
                    <span className="stat-value">2,841</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Total Volume</span>
                    <span className="stat-value">$93,470</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Ends In</span>
                    <span className="stat-value">302 days</span>
                  </div>
                </div>
                
                <div className="market-actions">
                  <div className="probability-bar-container" aria-label="Market probability">
                    <div className="probability-bar-labels">
                      <span className="prob-label-yes">YES — 67%</span>
                      <span className="prob-label-no">NO — 33%</span>
                    </div>
                    <div className="probability-bar-track" role="progressbar" aria-valuenow={67} aria-valuemin={0} aria-valuemax={100}>
                      <div className="probability-bar-fill" />
                    </div>
                  </div>
                  <div className="prediction-options">
                    <button className="prediction-btn yes">
                      <span className="prediction-label">YES</span>
                      <span className="prediction-probability">67%</span>
                      <span className="prediction-price">$0.67</span>
                    </button>
                    <button className="prediction-btn no">
                      <span className="prediction-label">NO</span>
                      <span className="prediction-probability">33%</span>
                      <span className="prediction-price">$0.33</span>
                    </button>
                  </div>
                  
                  <div className="market-code">
                    <details>
                      <summary>View Prediction Code</summary>
                      <div className="code-preview">
                        <pre className="language-python"><code className="language-python">{`btc_price = price("BTC", "now")
target_price = 200000
end_date = timestamp("2026-12-31")

if btc_price >= target_price:
    resolve_yes()
else:
    resolve_no()`}</code></pre>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                  <div className="container">
                    <h2 className="section-title">Why Choose PolyCraft?</h2>
                    <div className="features-grid">
                      <div className="feature-card">
                        <div className="feature-icon-wrap" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                        <h3>Custom Event Creation</h3>
                        <p>Create any type of prediction market — from sports outcomes to weather patterns to custom business metrics. The only limit is your imagination.</p>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon-wrap" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                        </div>
                        <h3>Python-like Prediction Code</h3>
                        <p>Write familiar, readable logic using Python-like syntax. Define exactly how outcomes are determined with clean, intuitive code anyone can understand.</p>
                      </div>
                      <div className="feature-card">
                        <div className="feature-icon-wrap" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <h3>Decentralized &amp; Trustless</h3>
                        <p>No central authority controls outcomes. Your code runs on-chain, ensuring transparent and tamper-proof results for every market.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* How It Works Section */}
            <section className="how-it-works-section">
              <div className="container">
                <h2 className="section-title">How It Works</h2>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3>Create Your Event</h3>
                      <p>Define your prediction market with custom parameters, timeline, and betting options.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3>Write Python-like Logic</h3>
                      <p>Use familiar Python syntax to write the code that determines how outcomes are calculated and verified automatically.</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3>Deploy & Trade</h3>
                      <p>Deploy your market and let traders bet on outcomes. Your code automatically settles when conditions are met.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Roadmap Section */}
            <section className="roadmap-section">
              <div className="container">
                <h2 className="section-title">Development Roadmap</h2>
                <div className="roadmap-timeline">
                  <div className="roadmap-item completed">
                    <div className="roadmap-marker"></div>
                    <div className="roadmap-content">
                      <h3>Phase 1: Core Platform</h3>
                      <p>Basic market creation, Python-like prediction code implementation, and wallet integration</p>
                      <span className="roadmap-status">Completed</span>
                    </div>
                  </div>
                  <div className="roadmap-item current">
                    <div className="roadmap-marker"></div>
                    <div className="roadmap-content">
                      <h3>Phase 2: Improved UI/UX & Analytics</h3>
                      <p>Improved UI/UX, analytics, and smarter prediction functions</p>
                      <span className="roadmap-status">In Progress — Q1 2026</span>
                    </div>
                  </div>
                  <div className="roadmap-item upcoming">
                    <div className="roadmap-marker"></div>
                    <div className="roadmap-content">
                      <h3>Phase 3: AI-Powered Features</h3>
                      <p>AI code explanation, market templates, and community governance</p>
                      <span className="roadmap-status">Q2 2026</span>
                    </div>
                  </div>
                  <div className="roadmap-item upcoming">
                    <div className="roadmap-marker"></div>
                    <div className="roadmap-content">
                      <h3>Phase 4: Enterprise Tools</h3>
                      <p>API access, bulk operations, and enterprise integrations</p>
                      <span className="roadmap-status">Q3 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <div className="container">
                <div className="cta-content">
                  <h2>Ready to Create Your First Market?</h2>
                  <p>Join thousands of creators building the future of decentralized prediction markets on Solana.</p>
                  <div className="cta-actions">
                    <button className="btn-primary" onClick={handleConnectWalletAndStart}>Start Creating Markets</button>
                    <button className="btn-secondary" onClick={handleViewDocs}>View Code Examples</button>
                  </div>
                </div>
              </div>
                </section>
              </main>
            );
        }
      };

      return (
        <div className="app">
          <Navbar onNavClick={handleNavClick} onCopyCA={handleCopyCA} contractAddress={contractAddress} onShowToast={showToast} />
          {renderPage()}
          <footer className="footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-brand">
                  <div className="footer-logo">
                    <img src={logo} alt="PolyCraft Logo" width="32" height="32" />
                    <span>PolyCraft</span>
                  </div>
                  <p className="footer-tagline">Decentralized Prediction Markets</p>
                </div>
                
                <div className="footer-links">
                  <div className="footer-section">
                    <h4>Community</h4>
                    <div className="footer-social">
                      <a href="https://github.com/Open-Poly" target="_blank" rel="noopener noreferrer" className="footer-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                      <a href="https://x.com/PolyCraftApp" target="_blank" rel="noopener noreferrer" className="footer-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X (Twitter)
                      </a>
                      <a href={pumpFunHref} target="_blank" rel="noopener noreferrer" className={`footer-link ${!contractAddress ? 'disabled' : ''}`} onClick={handlePumpFunClick} title={contractAddress ? "Pump.fun" : "Token will be launched soon"}>
                        <img src={pumpIcon} alt="Pump.fun" width="16" height="16" />
                        Pump.fun
                      </a>
                    </div>
                  </div>
                  
                  <div className="footer-section">
                    <h4>Contract Address</h4>
                    <div className="contract-address" onClick={handleCopyCA} title={contractAddress ? "Click to copy contract address" : "Contract address not available yet"}>
                      <span className="ca-label">CA: </span>
                      <span className={`contract-text ${!contractAddress ? 'ca-placeholder' : ''}`}>{contractAddress || "Will be added soon"}</span>
                      {contractAddress && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>&copy; 2026 PolyCraft. All rights reserved.</p>
                <p>Built on Solana</p>
              </div>
            </div>
          </footer>
          <Toast 
            message={toast.message} 
            isVisible={toast.isVisible} 
            onClose={hideToast} 
          />
        </div>
      )
}

export default App
