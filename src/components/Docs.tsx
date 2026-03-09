import React, { useEffect } from 'react';
import './Docs.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

// CodeBlock component using Prism.js
const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children, language = 'python' }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [children]);

  return (
    <div className="code-block">
      <pre className={`language-${language}`}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
};

const Docs: React.FC = () => {
  return (
    <div className="docs-page">
      <div className="container">
        <header className="docs-header">
          <h1>PolyCraft Documentation</h1>
          <p>Learn how to create prediction markets with Python-like code</p>
        </header>

        <section className="docs-section">
          <h2>Getting Started</h2>
          <p>PolyCraft uses Python-like syntax to define prediction market logic. Here are the basic concepts:</p>
          
          <div className="code-example">
            <h3>Basic Price Prediction</h3>
            <p>This example creates a market that resolves to "YES" if SOL price increases by 20% over 7 days:</p>
            <CodeBlock>{`price_now = price("SOL", "now")
price_7d_ago = price("SOL", "7 days ago")
if price_now >= price_7d_ago * 1.2:
    resolve_yes()
else:
    resolve_no()`}</CodeBlock>
          </div>

          <div className="code-example">
            <h3>Time-Based Prediction</h3>
            <p>Create a market that resolves based on a specific date:</p>
            <CodeBlock>{`current_time = now()
target_date = timestamp("2026-12-31")
if current_time >= target_date:
    resolve_yes()
else:
    resolve_no()`}</CodeBlock>
          </div>

          <div className="code-example">
            <h3>Multiple Condition Logic</h3>
            <p>Complex logic with multiple conditions:</p>
            <CodeBlock>{`btc_price = price("BTC", "now")
eth_price = price("ETH", "now")
market_cap = get_market_cap("crypto")

if btc_price > 50000 and eth_price > 3000:
    if market_cap > 2000000000000:  # 2 trillion
        resolve_yes()
    else:
        resolve_no()
else:
    resolve_no()`}</CodeBlock>
          </div>
        </section>

        <section className="docs-section">
          <h2>Available Functions</h2>
          
          <div className="function-list">
            <div className="function-item">
              <h3>price(token, time)</h3>
              <p>Get the price of a token at a specific time</p>
              <CodeBlock>{`price("SOL", "now")           # Current SOL price
price("BTC", "1 hour ago")    # BTC price 1 hour ago
price("ETH", "7 days ago")    # ETH price 7 days ago`}</CodeBlock>
            </div>

            <div className="function-item">
              <h3>now()</h3>
              <p>Get the current timestamp</p>
              <CodeBlock>{`current_time = now()`}</CodeBlock>
            </div>

            <div className="function-item">
              <h3>timestamp(date_string)</h3>
              <p>Convert a date string to timestamp</p>
            <CodeBlock>{`target_date = timestamp("2026-12-31")
election_day = timestamp("2026-11-03")`}</CodeBlock>
            </div>

            <div className="function-item">
              <h3>resolve_yes() / resolve_no()</h3>
              <p>Resolve the market outcome</p>
              <CodeBlock>{`if condition:
    resolve_yes()   # Market resolves to YES
else:
    resolve_no()    # Market resolves to NO`}</CodeBlock>
            </div>
          </div>
        </section>

        <section className="docs-section">
          <h2>Advanced Examples</h2>
          
          <div className="code-example">
            <h3>Sports Prediction</h3>
            <p>Predict the winner of a sports match:</p>
            <CodeBlock>{`team_a_score = get_score("team_a", "final")
team_b_score = get_score("team_b", "final")

if team_a_score > team_b_score:
    resolve_yes()  # Team A wins
elif team_b_score > team_a_score:
    resolve_no()   # Team B wins
else:
    resolve_tie()  # Draw`}</CodeBlock>
          </div>

          <div className="code-example">
            <h3>Weather Prediction</h3>
            <p>Predict weather conditions:</p>
            <CodeBlock>{`temperature = get_temperature("New York", "tomorrow")
humidity = get_humidity("New York", "tomorrow")

if temperature > 80 and humidity > 70:
    resolve_yes()  # Hot and humid
else:
    resolve_no()`}</CodeBlock>
          </div>

          <div className="code-example">
            <h3>Election Prediction</h3>
            <p>Predict election outcomes:</p>
            <CodeBlock>{`candidate_a_votes = get_votes("candidate_a")
candidate_b_votes = get_votes("candidate_b")
total_votes = candidate_a_votes + candidate_b_votes

if candidate_a_votes / total_votes > 0.5:
    resolve_yes()  # Candidate A wins
else:
    resolve_no()`}</CodeBlock>
          </div>
        </section>

        <section className="docs-section">
          <h2>Best Practices</h2>
          <ul className="best-practices">
            <li>Always use clear, descriptive variable names</li>
            <li>Test your logic with different scenarios</li>
            <li>Keep conditions simple and readable</li>
            <li>Use comments to explain complex logic</li>
            <li>Consider edge cases and tie scenarios</li>
            <li>Make sure your data sources are reliable</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Docs;
