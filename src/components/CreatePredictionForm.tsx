import { useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism-tomorrow.css'
import './CreatePredictionForm.css'

interface FormErrors {
  title?: string
  description?: string
  endDate?: string
  code?: string
}

interface CodeValidationResult {
  valid: boolean
  errors: string[]
}

// Allowed functions in code
const ALLOWED_FUNCTIONS = [
  'price',
  'resolve_yes',
  'resolve_no',
  'timestamp',
  'time',
  'date',
  'datetime',
  'now'
]

interface CreatedMarket {
  id: string
  title: string
  description: string
  endDate: string
  code: string
  createdAt: Date
}

const STORAGE_KEY = 'openpoly-predictions'

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 1000
const MAX_CODE_LENGTH = 5000

const CreatePredictionForm = () => {
  const { publicKey } = useWallet()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endDate, setEndDate] = useState('')
  const [code, setCode] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [createdMarkets, setCreatedMarkets] = useState<CreatedMarket[]>([])
  const [showClearModal, setShowClearModal] = useState(false)
  const codeBlockRef = useRef<HTMLPreElement>(null)
  const isInitialMount = useRef(true)

  // Format wallet address
  const formatWalletAddress = (address: string): string => {
    if (address.length > 10) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`
    }
    return address
  }

  const walletAddress = publicKey?.toString() || 'Not connected'

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && Array.isArray(parsed)) {
          // Restore Date objects
          const markets = parsed.map((m: CreatedMarket) => ({
            ...m,
            createdAt: new Date(m.createdAt)
          }))
          setCreatedMarkets(markets)
        }
      }
    } catch (error) {
      console.error('Failed to load predictions from localStorage:', error)
    }
  }, [])

  // Save data to localStorage on change
  useEffect(() => {
    // Skip on initial mount to avoid overwriting loaded data
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(createdMarkets))
    } catch (error) {
      console.error('Failed to save predictions to localStorage:', error)
    }
  }, [createdMarkets])

  // Validate Python code
  const validateCode = (codeText: string): CodeValidationResult => {
    const errors: string[] = []

    // Check for empty code
    if (!codeText.trim()) {
      return { valid: false, errors: ['Code is required'] }
    }

    // Check for dangerous imports
    if (codeText.includes('import ') || codeText.includes('from ')) {
      errors.push('Import statements are not allowed')
    }

    // Check for resolve calls
    const hasResolveYes = codeText.includes('resolve_yes(') || codeText.includes('resolve_yes ()')
    const hasResolveNo = codeText.includes('resolve_no(') || codeText.includes('resolve_no ()')

    if (!hasResolveYes && !hasResolveNo) {
      errors.push('Code must call either resolve_yes() or resolve_no()')
    }

    // Check for dangerous functions
    const dangerousFunctions = ['eval', 'exec', '__import__', 'open', 'file', '__builtins__']
    dangerousFunctions.forEach(func => {
      if (codeText.includes(func)) {
        errors.push(`Use of ${func} is not allowed`)
      }
    })

    // Check for unauthorized function calls
    const functionPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g
    const foundFunctions = new Set<string>()
    let match
    
    while ((match = functionPattern.exec(codeText)) !== null) {
      const funcName = match[1]
      foundFunctions.add(funcName)
    }

    // List of allowed built-in Python functions
    const allowedBuiltins = [
      'print', 'len', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 
      'abs', 'round', 'min', 'max', 'sum', 'range', 'enumerate', 'zip', 'sorted', 'reversed',
      'format', 'ord', 'chr'
    ]

    foundFunctions.forEach((funcName) => {
      const isKeyword = ['if', 'else', 'elif', 'for', 'while', 'def', 'return', 'with', 'as', 
        'try', 'except', 'finally', 'raise', 'assert', 'del', 'lambda', 'yield', 'async', 
        'await', 'break', 'continue', 'pass', 'global', 'nonlocal', 'and', 'or', 'not', 
        'in', 'is', 'None', 'True', 'False', 'and', 'or', 'not'].includes(funcName)
      
      const isOperator = ['==', '!=', '<=', '>=', '<', '>', '='].some(op => funcName.includes(op))
      
      if (!isKeyword && !isOperator) {
        const isAllowedFunction = ALLOWED_FUNCTIONS.includes(funcName)
        const isBuiltin = allowedBuiltins.includes(funcName)
        
        if (!isAllowedFunction && !isBuiltin && funcName !== '') {
          errors.push(`Unauthorized function "${funcName}". Allowed functions: ${ALLOWED_FUNCTIONS.join(', ')} and basic Python built-ins`)
        }
      }
    })

    // Check basic syntax (parentheses, brackets)
    const openParens = (codeText.match(/\(/g) || []).length
    const closeParens = (codeText.match(/\)/g) || []).length
    if (openParens !== closeParens) {
      errors.push('Unmatched parentheses in code')
    }

    const openBrackets = (codeText.match(/\[/g) || []).length
    const closeBrackets = (codeText.match(/\]/g) || []).length
    if (openBrackets !== closeBrackets) {
      errors.push('Unmatched brackets in code')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required'
    } else {
      const date = new Date(endDate)
      const now = new Date()
      if (date <= now) {
        newErrors.endDate = 'End date must be in the future'
      }
    }

    if (!code.trim()) {
      newErrors.code = 'Code is required'
    } else if (code.length > MAX_CODE_LENGTH) {
      newErrors.code = `Code must be less than ${MAX_CODE_LENGTH} characters`
    } else {
      const codeValidation = validateCode(code)
      if (!codeValidation.valid) {
        newErrors.code = codeValidation.errors.join('. ')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fill form with examples
  const handleFillWithExample = () => {
    const exampleTitle = 'Will Bitcoin reach $200,000 by December 31, 2026?'
    const exampleDescription = 'This market resolves to YES if Bitcoin (BTC) reaches or exceeds $200,000 USD on any major exchange (Coinbase, Binance, Kraken) by December 31, 2026 at 11:59 PM UTC. Price data will be sourced from CoinGecko\'s aggregated price feed.'
    const exampleCode = `btc_price = price("BTC", "now")
target_price = 200000
end_date = timestamp("2026-12-31")

if btc_price >= target_price:
    resolve_yes()
else:
    resolve_no()`

    // Use fixed example end date matching the description (Dec 31, 2026)
    const formattedDate = '2026-12-31T23:59'

    setTitle(exampleTitle)
    setDescription(exampleDescription)
    setEndDate(formattedDate)
    setCode(exampleCode)
    // Clear errors
    setErrors({})
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Form is valid:', { title, description, endDate, code })
      // Create market
      const newMarket: CreatedMarket = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        endDate,
        code: code.trim(),
        createdAt: new Date()
      }
      setCreatedMarkets([...createdMarkets, newMarket])
      // Scroll to created markets
      setTimeout(() => {
        const element = document.getElementById('your-predictions')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  // Delete single market
  const handleDeleteMarket = (id: string) => {
    setCreatedMarkets(createdMarkets.filter(market => market.id !== id))
  }

  // Clear all markets
  const handleClearAll = () => {
    setShowClearModal(true)
  }

  const confirmClearAll = () => {
    setCreatedMarkets([])
    setShowClearModal(false)
  }

  const cancelClearAll = () => {
    setShowClearModal(false)
  }

  // Update syntax highlighting on code change
  useEffect(() => {
    if (codeBlockRef.current) {
      Prism.highlightElement(codeBlockRef.current)
    }
    // Highlight code in created markets
    if (createdMarkets.length > 0) {
      setTimeout(() => {
        Prism.highlightAll()
      }, 100)
    }
  }, [code, title, description, endDate, createdMarkets])

  // Format date for display in "Ends" field
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not set'

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Not set'

      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return 'Not set'
    }
  }

  // Generate example based on form
  const generateExample = () => {
    return {
      title: title || 'Your Prediction Market',
      description: description || 'Market description will appear here',
      endDate: formatDate(endDate),
      code: code || '# Enter your prediction code here\n# The preview will update as you type'
    }
  }

  const example = generateExample()

  return (
    <div className="create-prediction-container">
      <div className="form-preview-grid">
        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">Create Prediction Market</h2>
            <button type="button" onClick={handleFillWithExample} className="fill-example-btn">
              Fill with Example
            </button>
          </div>
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-group">
              <label htmlFor="title">Market Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Will Bitcoin reach $100,000?"
                className={errors.title ? 'error' : ''}
                maxLength={MAX_TITLE_LENGTH}
              />
              <div className="char-counter">
                {title.length} / {MAX_TITLE_LENGTH}
              </div>
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your prediction market..."
                rows={4}
                className={errors.description ? 'error' : ''}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <div className="char-counter">
                {description.length} / {MAX_DESCRIPTION_LENGTH}
              </div>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date *</label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="code">Prediction Code *</label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`# Example code\nprice_now = price("SOL", "now")\nprice_7d_ago = price("SOL", "7 days ago")\n\nif price_now >= price_7d_ago * 1.2:\n    resolve_yes()\nelse:\n    resolve_no()`}
                rows={12}
                className={errors.code ? 'error' : ''}
                spellCheck={false}
                maxLength={MAX_CODE_LENGTH}
              />
              <div className="char-counter">
                {code.length} / {MAX_CODE_LENGTH}
              </div>
              {errors.code && <span className="error-message">{errors.code}</span>}
              <div className="code-hint">
                Allowed prediction functions: {ALLOWED_FUNCTIONS.join(', ')}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Create Market
            </button>
          </form>
        </div>

        <div className="preview-section">
          <h2 className="form-title">Live Preview</h2>
          <div className="market-card">
            <div className="market-header">
              <div className="market-creator">
                <div className="creator-avatar">👤</div>
                <div className="creator-info">
                  <span className="creator-name">{publicKey ? formatWalletAddress(walletAddress) : 'Not connected'}</span>
                </div>
              </div>
            </div>

            <div className="market-content">
              <h3 className="market-title">{example.title}</h3>
              <p className="market-description">{example.description}</p>

              <div className="market-stats">
                <div className="stat stat-ends">
                  <span className="stat-label">Ends</span>
                  <span className="stat-value stat-value-ends">{example.endDate || 'Not set'}</span>
                </div>
              </div>

              <div className="market-actions">
                <div className="market-code">
                  <details open>
                    <summary>Prediction Code</summary>
                    <div className="code-preview">
                      <pre className="language-python" ref={codeBlockRef} key={code}>
                        <code className="language-python">{example.code}</code>
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>

        {createdMarkets.length > 0 && (
          <div className="created-market-section" id="your-predictions">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">Your Predictions</h2>
                <button onClick={handleClearAll} className="clear-all-btn">
                  Clear All
                </button>
              </div>
              
              <div className="markets-list">
                {createdMarkets.map((market) => (
                  <div key={market.id} className="market-card">
                    <div className="market-header">
                      <div className="market-creator">
                        <div className="creator-avatar">👤</div>
                        <div className="creator-info">
                          <span className="creator-name">{publicKey ? formatWalletAddress(publicKey.toString()) : 'Not connected'}</span>
                        </div>
                      </div>
                      <div className="market-status">
                        <button 
                          onClick={() => handleDeleteMarket(market.id)} 
                          className="delete-market-btn"
                          title="Delete prediction"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="market-content">
                      <h3 className="market-title">{market.title}</h3>
                      <p className="market-description">{market.description}</p>

                      <div className="market-stats">
                        <div className="stat">
                          <span className="stat-label">Participants</span>
                          <span className="stat-value">0</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Total Volume</span>
                          <span className="stat-value">$0</span>
                        </div>
                        <div className="stat stat-ends">
                          <span className="stat-label">Ends</span>
                          <span className="stat-value stat-value-ends">{formatDate(market.endDate)}</span>
                        </div>
                      </div>

                      <div className="market-actions">
                        <div className="prediction-options">
                          <button className="prediction-btn yes">
                            <span className="prediction-label">YES</span>
                            <span className="prediction-probability">50%</span>
                            <span className="prediction-price">$0.50</span>
                          </button>
                          <button className="prediction-btn no">
                            <span className="prediction-label">NO</span>
                            <span className="prediction-probability">50%</span>
                            <span className="prediction-price">$0.50</span>
                          </button>
                        </div>

                        <div className="market-code">
                          <details>
                            <summary>View Prediction Code</summary>
                            <div className="code-preview">
                              <pre className="language-python"><code className="language-python">{market.code}</code></pre>
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Clear All */}
      {showClearModal && (
        <div className="modal-overlay" onClick={cancelClearAll}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Clear All Predictions?</h3>
            <p className="modal-message">
              Are you sure you want to delete all {createdMarkets.length} prediction{createdMarkets.length !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={cancelClearAll} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={confirmClearAll} className="modal-btn confirm">
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePredictionForm

