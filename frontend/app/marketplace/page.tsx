/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, ShoppingCart, Leaf, TrendingUp, MapPin, ShieldCheck,
  AlertCircle, RefreshCw, SlidersHorizontal, Heart, X,
  ChevronDown, Filter, Zap, Package, Star, ArrowUpRight,
  BarChart2, Globe
} from 'lucide-react';
import api from '@/lib/api';

const CATEGORIES = [
  { id: 'ALL', label: 'All Produce', icon: '🌾' },
  { id: 'VEGETABLES', label: 'Vegetables', icon: '🥦' },
  { id: 'FRUITS', label: 'Fruits', icon: '🍊' },
  { id: 'GRAINS', label: 'Grains', icon: '🌽' },
  { id: 'DAIRY', label: 'Dairy', icon: '🥛' },
  { id: 'MEAT', label: 'Meat', icon: '🥩' },
  { id: 'OTHER', label: 'Other', icon: '🌿' },
];

const REGIONS = [
  'Greater Accra', 'Ashanti Region', 'Northern Region',
  'Volta Region', 'Brong Ahafo Region', 'Bono Region'
];
const GRADES = ['Premium', 'Grade A', 'Grade B', 'Standard'];

const MARKET_TICKER = [
  { label: 'Tomatoes (Accra)', price: 'GHS 420/MT', change: '+3.2%', up: true },
  { label: 'Maize (Ashanti)', price: 'GHS 780/MT', change: '-1.1%', up: false },
  { label: 'Cocoa (Brong A.)', price: 'GHS 14,200/MT', change: '+0.8%', up: true },
  { label: 'Rice (Northern)', price: 'GHS 2,100/MT', change: '+2.4%', up: true },
  { label: 'Yam (Volta)', price: 'GHS 950/MT', change: '-0.5%', up: false },
  { label: 'Groundnut (Bono)', price: 'GHS 3,400/MT', change: '+1.7%', up: true },
];

export default function MarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const tickerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    category: 'ALL',
    region: '',
    qualityGrade: '',
    isOrganic: false,
    minPrice: '',
    maxPrice: '',
    minBulkQuantity: '',
    sort: 'latest',
  });

  useEffect(() => {
    const id = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (filters.category !== 'ALL') q.append('category', filters.category);
      if (filters.region) q.append('region', filters.region);
      if (filters.qualityGrade) q.append('qualityGrade', filters.qualityGrade);
      if (filters.isOrganic) q.append('isOrganic', 'true');
      if (filters.minPrice) q.append('minPrice', filters.minPrice);
      if (filters.maxPrice) q.append('maxPrice', filters.maxPrice);
      if (filters.minBulkQuantity) q.append('minBulkQuantity', filters.minBulkQuantity);
      if (filters.sort !== 'latest') q.append('sort', filters.sort);
      if (searchTerm) q.append('search', searchTerm);
      const res = await api.get(`/products?${q.toString()}`);
      setProducts(res.data);
    } catch (e) {
      console.error('Failed to fetch products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (key: string, value: any) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({ category: 'ALL', region: '', qualityGrade: '', isOrganic: false, minPrice: '', maxPrice: '', minBulkQuantity: '', sort: 'latest' });
    setSearchTerm('');
  };

  const toggleWishlist = (id: string) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const activeFilterCount = [
    filters.category !== 'ALL', filters.region, filters.qualityGrade,
    filters.isOrganic, filters.minPrice, filters.maxPrice, filters.minBulkQuantity,
    filters.sort !== 'latest'
  ].filter(Boolean).length;

  return (
    <div className="mp-page">

      {/* ── LIVE MARKET TICKER ── */}
      <div className="mp-ticker-wrap">
        <div className="mp-ticker-label">
          <Zap size={12} /> LIVE
        </div>
        <div className="mp-ticker-track" ref={tickerRef}>
          <div className="mp-ticker-inner">
            {[...MARKET_TICKER, ...MARKET_TICKER].map((item, i) => (
              <span key={i} className="mp-ticker-item">
                <span className="mp-ticker-name">{item.label}</span>
                <span className="mp-ticker-price">{item.price}</span>
                <span className={`mp-ticker-change ${item.up ? 'up' : 'down'}`}>
                  {item.up ? '▲' : '▼'} {item.change}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="mp-hero">
        <div className="mp-hero-bg" />
        <div className="mp-hero-content">
          <div className="mp-hero-badge">
            <Globe size={13} /> West Africa's #1 Agricultural Exchange
          </div>
          <h1 className="mp-hero-title">Enterprise<br /><span className="mp-hero-accent">Marketplace</span></h1>
          <p className="mp-hero-sub">Secure, verified bulk agricultural trading — direct from farm to business.</p>

          {/* Stats row */}
          <div className="mp-stats-row">
            {[
              { icon: <Package size={18} />, val: '2,400+', label: 'Listings' },
              { icon: <ShieldCheck size={18} />, val: '98%', label: 'Verified Sellers' },
              { icon: <BarChart2 size={18} />, val: 'GHS 1,420', label: 'Avg. Index Today' },
              { icon: <TrendingUp size={18} />, val: '+2.4%', label: 'Market Growth' },
            ].map((s, i) => (
              <div key={i} className="mp-stat-chip">
                <span className="mp-stat-icon">{s.icon}</span>
                <div>
                  <div className="mp-stat-val">{s.val}</div>
                  <div className="mp-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="mp-search-wrap">
        <div className="mp-search-bar">
          <Search size={20} className="mp-search-icon" />
          <input
            id="marketplace-search"
            type="text"
            className="mp-search-input"
            placeholder="Search crop, farmer name, or cooperative..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="mp-search-clear" onClick={() => setSearchTerm('')} title="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <button
          className={`mp-filter-toggle ${activeFilterCount > 0 ? 'active' : ''}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title="Toggle Filters"
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && <span className="mp-filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="mp-cats-wrap">
        <div className="mp-cats-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`mp-cat-pill ${filters.category === cat.id ? 'active' : ''}`}
              onClick={() => handleFilter('category', cat.id)}
              title={cat.label}
            >
              <span className="mp-cat-icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="mp-body">

        {/* FILTER SIDEBAR */}
        {isSidebarOpen && (
          <aside className="mp-sidebar">
            <div className="mp-sidebar-header">
              <span className="d-flex items-center gap-2">
                <SlidersHorizontal size={16} />
                <strong>Advanced Filters</strong>
              </span>
              <div className="d-flex items-center gap-4">
                {activeFilterCount > 0 && (
                  <button className="mp-reset-btn" onClick={resetFilters}>Reset all</button>
                )}
                <button className="mp-close-btn" onClick={() => setIsSidebarOpen(false)} title="Close">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="mp-sidebar-body">

              {/* Sort */}
              <div className="mp-filter-group">
                <label htmlFor="sort-select" className="mp-filter-label">Sort By</label>
                <div className="mp-select-wrap">
                  <select
                    id="sort-select"
                    className="mp-select"
                    value={filters.sort}
                    onChange={e => handleFilter('sort', e.target.value)}
                  >
                    <option value="latest">Recently Added</option>
                    <option value="lowest_price">Lowest Price</option>
                    <option value="highest_qty">Highest Quantity</option>
                    <option value="most_trusted">Most Trusted Seller</option>
                  </select>
                  <ChevronDown size={14} className="mp-select-arrow" />
                </div>
              </div>

              {/* Price Range */}
              <div className="mp-filter-group">
                <label className="mp-filter-label">Price Range (GHS)</label>
                <div className="d-flex gap-2 items-center">
                  <input
                    id="min-price"
                    type="number"
                    className="mp-input"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => handleFilter('minPrice', e.target.value)}
                    title="Min price"
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>–</span>
                  <input
                    id="max-price"
                    type="number"
                    className="mp-input"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => handleFilter('maxPrice', e.target.value)}
                    title="Max price"
                  />
                </div>
              </div>

              {/* Bulk Qty */}
              <div className="mp-filter-group">
                <label htmlFor="bulk-qty" className="mp-filter-label">Min. Bulk Quantity (MT)</label>
                <input
                  id="bulk-qty"
                  type="number"
                  className="mp-input"
                  placeholder="e.g. 50"
                  value={filters.minBulkQuantity}
                  onChange={e => handleFilter('minBulkQuantity', e.target.value)}
                  title="Min bulk qty"
                />
              </div>

              {/* Region */}
              <div className="mp-filter-group">
                <label htmlFor="region-select" className="mp-filter-label">Source Region</label>
                <div className="mp-select-wrap">
                  <select
                    id="region-select"
                    className="mp-select"
                    value={filters.region}
                    onChange={e => handleFilter('region', e.target.value)}
                  >
                    <option value="">All Regions</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={14} className="mp-select-arrow" />
                </div>
              </div>

              {/* Grade */}
              <div className="mp-filter-group">
                <label htmlFor="grade-select" className="mp-filter-label">Quality Grade</label>
                <div className="mp-select-wrap">
                  <select
                    id="grade-select"
                    className="mp-select"
                    value={filters.qualityGrade}
                    onChange={e => handleFilter('qualityGrade', e.target.value)}
                  >
                    <option value="">Any Grade</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <ChevronDown size={14} className="mp-select-arrow" />
                </div>
              </div>

              {/* Organic toggle */}
              <label htmlFor="organic-check" className={`mp-toggle-label ${filters.isOrganic ? 'active' : ''}`}>
                <input
                  id="organic-check"
                  type="checkbox"
                  checked={filters.isOrganic}
                  onChange={e => handleFilter('isOrganic', e.target.checked)}
                  className="mp-toggle-input"
                  title="Organic only"
                />
                <span className="mp-toggle-track">
                  <span className="mp-toggle-thumb" />
                </span>
                <span>Organic Certified Only</span>
              </label>

              {/* AI Insight */}
              <div className="mp-ai-insight">
                <AlertCircle size={14} />
                <p><strong>AI Insight:</strong> Tomato supply in Brong Ahafo is down 15%. Prices expected to rise by weekend.</p>
              </div>

            </div>
          </aside>
        )}

        {/* PRODUCTS GRID */}
        <main className="mp-main">

          {/* Results meta */}
          <div className="mp-results-meta">
            <span className="mp-results-count">
              {isLoading ? 'Loading...' : `${products.length} verified ${products.length === 1 ? 'commodity' : 'commodities'}`}
            </span>
            {activeFilterCount > 0 && (
              <button className="mp-clear-link" onClick={resetFilters}>
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="mp-loading">
              <div className="mp-loading-spinner">
                <RefreshCw size={32} className="mp-spin" />
              </div>
              <p>Scanning ecosystem...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="mp-empty">
              <div className="mp-empty-icon">
                <Leaf size={48} />
              </div>
              <h3>No produce found</h3>
              <p>Try adjusting your filters or search terms to find available commodities.</p>
              <button className="mp-empty-btn" onClick={resetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="mp-grid">
              {products.map(product => (
                <div
                  key={product.id}
                  className="mp-card"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  {/* Image */}
                  <div className="mp-card-img">
                    {product.imageUrls?.length > 0 ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        fill
                        className="mp-card-photo"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="mp-card-no-img">
                        <Leaf size={36} />
                      </div>
                    )}

                    {/* Overlay badges */}
                    <div className="mp-card-badges">
                      {product.isOrganic && (
                        <span className="mp-badge organic">🌿 Organic</span>
                      )}
                      <span className="mp-badge grade">{product.qualityGrade}</span>
                    </div>

                    {/* Wishlist */}
                    <button
                      className={`mp-wish-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                      onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
                      title="Save to wishlist"
                    >
                      <Heart size={16} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="mp-card-body">
                    {/* Farmer row */}
                    <Link
                      href={`/farmers/${product.farmer.id}`}
                      onClick={e => e.stopPropagation()}
                      className="mp-farmer-row"
                    >
                      <div className="mp-farmer-avatar">
                        {product.farmer.name.charAt(0)}
                      </div>
                      <span className="mp-farmer-name">{product.farmer.name}</span>
                      {product.farmer.isVerified && (
                        <ShieldCheck size={14} className="mp-verified-icon" />
                      )}
                      <ArrowUpRight size={13} className="mp-farmer-arrow" />
                    </Link>

                    {/* Product name */}
                    <h3 className="mp-card-title">{product.name}</h3>

                    {/* Location */}
                    <div className="mp-card-loc">
                      <MapPin size={13} />
                      <span>{product.region}</span>
                    </div>

                    {/* Divider */}
                    <div className="mp-card-divider" />

                    {/* Pricing row */}
                    <div className="mp-price-row">
                      <div>
                        <div className="mp-price-label">Wholesale Price</div>
                        <div className="mp-price-val">
                          {product.price.toLocaleString()}
                          <span className="mp-price-unit"> GHS</span>
                        </div>
                      </div>
                      <div className="mp-qty-block">
                        <div className="mp-price-label">Available</div>
                        <div className="mp-qty-val">{product.availableQuantity} MT</div>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="mp-meta-row">
                      <span>Min: <strong>{product.minOrderQuantity} MT</strong></span>
                      <span>Harvest: <strong>{new Date(product.harvestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</strong></span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="mp-cta-row">
                      <button className="mp-btn-buy" title={`Buy ${product.name}`}>
                        <ShoppingCart size={15} /> Buy Now
                      </button>
                      <button
                        className="mp-btn-quote"
                        onClick={e => e.preventDefault()}
                        title="Request bulk quote"
                      >
                        <Star size={14} /> Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
