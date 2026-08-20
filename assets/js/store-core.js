/* ==========================================================================
   store-core.js — SHARED store logic (single source of truth)
   Loaded by: admin.html, every generated producto/{slug}.html, catalogo.html
   Cache-busted with ?v=<PRODUCTS_VERSION> everywhere it's referenced.

   PRICE PRECEDENCE (one rule, applied everywhere price is read):
     storage-row override  ->  color-row override  ->  product base price
   Same chain for cost. Capacity (storage) is the dominant price driver for
   Apple gear, so a storage override wins over a color override when both a
   storage row AND a color row carry their own price. If you'd rather colors
   add a surcharge on top, that's a deliberate change to make HERE, once.
   ========================================================================== */
(function (root) {
  'use strict';

  function fmtCOP(n) {
    if (n == null || isNaN(n)) return '—';
    return '$' + Math.round(n).toLocaleString('es-CO');
  }

  function rowOf(product, dim, label) {
    if (!product || !Array.isArray(product[dim])) return null;
    return product[dim].find(function (r) { return r.label === label; }) || null;
  }

  // Which variant dimensions actually exist on this product.
  function dimsOf(product) {
    var d = [];
    if (product && Array.isArray(product.storage) && product.storage.length) d.push('storage');
    if (product && Array.isArray(product.color) && product.color.length) d.push('color');
    return d;
  }

  // Shared price resolver. sel = { storage: <label|null>, color: <label|null> }.
  function unitPrice(product, sel) {
    sel = sel || {};
    var s = sel.storage ? rowOf(product, 'storage', sel.storage) : null;
    var c = sel.color ? rowOf(product, 'color', sel.color) : null;
    if (s && s.price > 0) return s.price;   // storage override wins
    if (c && c.price > 0) return c.price;   // then color override
    return product.price;                    // then base
  }

  // Same precedence for internal cost (never rendered on public pages).
  function unitCost(product, sel) {
    sel = sel || {};
    var s = sel.storage ? rowOf(product, 'storage', sel.storage) : null;
    var c = sel.color ? rowOf(product, 'color', sel.color) : null;
    if (s && s.cost > 0) return s.cost;
    if (c && c.cost > 0) return c.cost;
    return product.cost;
  }

  /* Availability across BOTH dimensions independently.
     - If BOTH storage and color are populated, the buyer must pick BOTH; the
       available units = the MINIMUM across the two selected rows.
     - If only one dimension is populated, pick that one; units = that row.
     - If neither, it's a simple product; units = product.stock (may be null =
       "consultar").
     Returns { ready, need:[dims still unpicked], units:(int|null) }. */
  function availability(product, sel) {
    sel = sel || {};
    var dims = dimsOf(product);
    var need = dims.filter(function (d) { return !sel[d]; });
    if (need.length) return { ready: false, need: need, units: null };
    if (!dims.length) {
      var base = (product.stock == null) ? null : Number(product.stock);
      return { ready: true, need: [], units: base };
    }
    var units = Math.min.apply(null, dims.map(function (d) {
      var row = rowOf(product, d, sel[d]);
      return row ? Number(row.units || 0) : 0;
    }));
    return { ready: true, need: [], units: units };
  }

  var API = {
    fmtCOP: fmtCOP,
    rowOf: rowOf,
    dimsOf: dimsOf,
    unitPrice: unitPrice,
    unitCost: unitCost,
    availability: availability
  };

  root.StoreCore = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : this);
