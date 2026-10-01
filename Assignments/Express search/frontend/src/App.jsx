import React, { useState, useEffect, useMemo, useRef } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from './config';
import './App.css';

// Professional SVG Icons
const SearchIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const DownloadIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CopyIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="13" height="13" x="9" y="9" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const GridViewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const ListViewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const FileFormatIcon = ({ type, size = 22 }) => {
  const t = (type || '').toLowerCase();
  if (t === '.pdf') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15h6" />
        <path d="M9 11h6" />
      </svg>
    );
  }
  if (t === '.docx' || t === '.doc') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
};

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function App() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [copiedFile, setCopiedFile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [toast, setToast] = useState(null);

  const searchInputRef = useRef(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Shortcut key listener ('/' focuses search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show floating toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Human-readable size converter
  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) return 'N/A';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Extension classifier
  const getTypeClass = (type = '') => {
    const ext = type.toLowerCase().replace('.', '');
    if (ext === 'pdf') return 'type-pdf';
    if (ext === 'docx' || ext === 'doc') return 'type-docx';
    if (ext === 'txt') return 'type-txt';
    return 'type-other';
  };

  // Fetch files from Express Backend
  const fetchFiles = async (searchKeyword = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = API_ENDPOINTS.searchFiles(searchKeyword);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Backend returned status ${res.status}`);
      }

      const data = await res.json();
      setFiles(data.files || []);
      setSubmittedQuery(searchKeyword);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(
        `Unable to reach Express backend at ${API_BASE_URL}. Ensure the server is running on port 5000.`
      );
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFiles('');
  }, []);

  // Form submit
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    fetchFiles(query.trim());
  };

  // Clear query
  const handleClear = () => {
    setQuery('');
    fetchFiles('');
  };

  // Copy filename to clipboard
  const handleCopyName = (fileName) => {
    navigator.clipboard.writeText(fileName);
    setCopiedFile(fileName);
    showToast(`Copied "${fileName}" to clipboard`);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Streaming File Download
  const handleDownload = async (fileName) => {
    try {
      setDownloadingFile(fileName);
      showToast(`Initiating download for ${fileName}...`, 'success');

      const downloadUrl = API_ENDPOINTS.downloadFile(fileName);
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Download failed with HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = objectUrl;
      tempLink.setAttribute('download', fileName);
      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();
      window.URL.revokeObjectURL(objectUrl);

      showToast(`Successfully downloaded ${fileName}!`, 'success');
    } catch (err) {
      console.error('Download failure:', err);
      showToast(`Download failed: ${err.message}`, 'error');
    } finally {
      setTimeout(() => {
        setDownloadingFile(null);
      }, 1000);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter((file) => {
        const ext = (file.type || '').toLowerCase().replace('.', '');
        return ext === typeFilter;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'size-desc') return (b.size || 0) - (a.size || 0);
      if (sortBy === 'size-asc') return (a.size || 0) - (b.size || 0);
      return 0;
    });

    return result;
  }, [files, typeFilter, sortBy]);

  // Aggregate Metrics
  const totalVolumeBytes = useMemo(() => {
    return files.reduce((acc, f) => acc + (f.size || 0), 0);
  }, [files]);

  const typeCounts = useMemo(() => {
    return {
      all: files.length,
      pdf: files.filter((f) => (f.type || '').toLowerCase() === '.pdf').length,
      docx: files.filter((f) => (f.type || '').toLowerCase() === '.docx').length,
      txt: files.filter((f) => (f.type || '').toLowerCase() === '.txt').length,
    };
  }, [files]);

  return (
    <div className="app-container">
      <div className="ambient-glow" />

      {/* Top Glass Navbar */}
      <nav className="navbar">
        <div className="brand-section">
          <div className="brand-icon-box">
            <SearchIcon size={22} />
          </div>
          <div>
            <div className="brand-title">
              FileHub <span>Engine</span>
            </div>
            <div className="brand-tag">CS302 Semester 3 Assignment</div>
          </div>
        </div>

        <div className="nav-actions">
          <div className="backend-status-pill">
            <span className={`status-dot ${error ? 'error' : 'pulsing'}`} />
            <span>{error ? 'Backend Offline' : 'Express :5000 Live'}</span>
          </div>

          <button
            className="theme-btn"
            onClick={toggleTheme}
            title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="hero-section">
        <div className="hero-pill">
          <span>Enterprise File Search & Streaming</span>
        </div>
        <h1 className="hero-title">
          Search, Inspect & <span className="gradient-text">Download Stored Files</span>
        </h1>
        <p className="hero-subtitle">
          A decoupled full-stack architecture powered by React 18 frontend and Node.js + Express.js backend with path-traversal protection.
        </p>

        {/* Aggregate Metrics Bar */}
        <div className="metrics-strip">
          <div className="metric-card">
            <div className="metric-icon-wrap">
              <FileFormatIcon type=".pdf" size={20} />
            </div>
            <div>
              <div className="metric-value">{files.length}</div>
              <div className="metric-label">Stored Files</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap">
              <DownloadIcon size={20} />
            </div>
            <div>
              <div className="metric-value">{formatFileSize(totalVolumeBytes)}</div>
              <div className="metric-label">Total Volume</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap">
              <SearchIcon size={20} />
            </div>
            <div>
              <div className="metric-value">3 Types</div>
              <div className="metric-label">PDF, DOCX, TXT</div>
            </div>
          </div>
        </div>
      </header>

      {/* Control Hub (Search, Filters, Sort, View) */}
      <section className="control-hub">
        <form className="search-form-pro" onSubmit={handleSubmit}>
          <div className="search-icon-box">
            <SearchIcon size={20} />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            className="search-input-pro"
            placeholder="Search files by keyword (e.g. math, assignment, pdf, notes)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <span className="kbd-badge" title="Press '/' anywhere to search">
            /
          </span>

          {query && (
            <button
              type="button"
              className="clear-btn-pro"
              onClick={handleClear}
              title="Clear search"
            >
              <CloseIcon />
            </button>
          )}

          <button type="submit" className="search-btn-pro">
            <SearchIcon size={18} />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Tag Suggestions */}
        <div className="quick-tags-row">
          <span>Quick queries:</span>
          {['math', 'assignment', 'notes', 'guide', 'pdf'].map((tag) => (
            <button
              key={tag}
              type="button"
              className="quick-tag-chip"
              onClick={() => {
                setQuery(tag);
                fetchFiles(tag);
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Secondary Filter & Sort Bar */}
        <div className="controls-bottom-row">
          <div className="filter-pills-wrap">
            <button
              className={`filter-pill ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              <span>All Files</span>
              <span className="pill-count">{typeCounts.all}</span>
            </button>

            <button
              className={`filter-pill ${typeFilter === 'pdf' ? 'active' : ''}`}
              onClick={() => setTypeFilter('pdf')}
            >
              <span>PDF Documents</span>
              <span className="pill-count">{typeCounts.pdf}</span>
            </button>

            <button
              className={`filter-pill ${typeFilter === 'docx' ? 'active' : ''}`}
              onClick={() => setTypeFilter('docx')}
            >
              <span>Word Docs</span>
              <span className="pill-count">{typeCounts.docx}</span>
            </button>

            <button
              className={`filter-pill ${typeFilter === 'txt' ? 'active' : ''}`}
              onClick={() => setTypeFilter('txt')}
            >
              <span>Text Notes</span>
              <span className="pill-count">{typeCounts.txt}</span>
            </button>
          </div>

          <div className="view-sort-group">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="size-desc">Sort: Size (Largest)</option>
              <option value="size-asc">Sort: Size (Smallest)</option>
            </select>

            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Card View"
              >
                <GridViewIcon />
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List Table View"
              >
                <ListViewIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="content-area-pro">
        {/* Error Diagnostic Card */}
        {error && (
          <div className="error-card-pro">
            <div className="error-icon-box">
              <CloseIcon />
            </div>
            <div className="error-content-box">
              <h3 className="error-heading">Backend Connection Error</h3>
              <p className="error-text">{error}</p>
              <div className="diagnostic-steps">
                <div>Terminal Diagnostic Steps:</div>
                <div>1. Open terminal: <code>cd backend</code></div>
                <div>2. Start server: <code>node server.js</code></div>
                <div>3. API Endpoint: <code>{API_BASE_URL}/api/health</code></div>
              </div>
              <button
                className="retry-connection-btn"
                onClick={() => fetchFiles(query)}
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Skeleton Loading Cards */}
        {loading && (
          <div className="skeleton-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="skeleton-line" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-line" style={{ height: '18px', width: '70%', marginBottom: '8px' }} />
                    <div className="skeleton-line" style={{ height: '14px', width: '40%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                  <div className="skeleton-line" style={{ height: '16px', width: '90px' }} />
                  <div className="skeleton-line" style={{ height: '34px', width: '100px', borderRadius: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Meta Header */}
        {!loading && !error && (
          <div className="results-summary-strip">
            <span>
              {submittedQuery ? (
                <>
                  Matching <span className="highlight-keyword">"{submittedQuery}"</span>:
                </>
              ) : (
                'Showing repository files:'
              )}
            </span>
            <span className="results-count-bold">
              {filteredAndSortedFiles.length} {filteredAndSortedFiles.length === 1 ? 'file' : 'files'}
            </span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedFiles.length === 0 && (
          <div className="empty-state-pro">
            <div className="empty-state-icon-box">
              <SearchIcon size={32} />
            </div>
            <h3 className="empty-title">No matching files found</h3>
            <p className="empty-desc">
              We couldn't find any file matching your criteria. Try adjusting your keyword or reset filters to see all available files.
            </p>
            <button className="reset-search-btn" onClick={handleClear}>
              Reset All Filters
            </button>
          </div>
        )}

        {/* Grid View */}
        {!loading && !error && filteredAndSortedFiles.length > 0 && viewMode === 'grid' && (
          <div className="file-grid-pro">
            {filteredAndSortedFiles.map((file) => {
              const typeClass = getTypeClass(file.type);
              const isDownloading = downloadingFile === file.name;
              const isCopied = copiedFile === file.name;

              return (
                <div key={file.name} className="file-card-pro">
                  <div className="card-top-row">
                    <div className={`file-symbol-box ${typeClass}`}>
                      <FileFormatIcon type={file.type} size={24} />
                    </div>

                    <div className="card-heading-box">
                      <h4 className="card-filename" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="card-badges-row">
                        <span className={`ext-badge ${typeClass}`}>
                          {file.type ? file.type.toUpperCase() : 'FILE'}
                        </span>
                        <span className="filesize-mono">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer-pro">
                    <div className="card-actions-row">
                      <button
                        className="copy-name-btn"
                        onClick={() => handleCopyName(file.name)}
                        title="Copy filename to clipboard"
                      >
                        {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        className={`dl-btn-pro ${isDownloading ? 'downloading' : ''}`}
                        onClick={() => handleDownload(file.name)}
                        disabled={isDownloading}
                        title={`Download ${file.name}`}
                      >
                        {isDownloading ? (
                          <>
                            <CheckIcon size={15} />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <DownloadIcon size={15} />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List / Table View */}
        {!loading && !error && filteredAndSortedFiles.length > 0 && viewMode === 'list' && (
          <div className="table-container">
            <table className="files-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Location</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedFiles.map((file) => {
                  const typeClass = getTypeClass(file.type);
                  const isDownloading = downloadingFile === file.name;

                  return (
                    <tr key={file.name}>
                      <td>
                        <div className="table-file-cell">
                          <div className={`table-symbol-mini ${typeClass}`}>
                            <FileFormatIcon type={file.type} size={18} />
                          </div>
                          <span style={{ fontWeight: 600 }}>{file.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`ext-badge ${typeClass}`}>
                          {file.type ? file.type.toUpperCase() : 'FILE'}
                        </span>
                      </td>
                      <td>
                        <span className="filesize-mono">{formatFileSize(file.size)}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                        backend/files/
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            className="copy-name-btn"
                            onClick={() => handleCopyName(file.name)}
                            title="Copy filename"
                          >
                            <CopyIcon size={14} />
                          </button>
                          <button
                            className={`dl-btn-pro ${isDownloading ? 'downloading' : ''}`}
                            onClick={() => handleDownload(file.name)}
                            disabled={isDownloading}
                            title={`Download ${file.name}`}
                          >
                            {isDownloading ? <CheckIcon size={14} /> : <DownloadIcon size={14} />}
                            <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckIcon size={18} /> : <CloseIcon />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Footer Pro */}
      <footer className="app-footer-pro">
        <div className="footer-left">
          <span>Technology Stack:</span>
          <span className="tech-badge">React 18</span>
          <span className="tech-badge">Node.js</span>
          <span className="tech-badge">Express.js</span>
          <span className="tech-badge">Vite</span>
        </div>
        <div>
          Connected API: <span className="tech-badge">{API_BASE_URL}</span>
        </div>
      </footer>
    </div>
  );
}
