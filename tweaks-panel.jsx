/*
  tweaks-panel.jsx — lightweight live-customization panel for the Parra Shop mockup.
  Exposes TweaksPanel / TweakSection / TweakColor / TweakToggle / useTweaks on window
  so the inline <script type="text/babel"> at the bottom of index.html can use them.

  Purpose: during a sales pitch you can recolor the brand accent and toggle whole
  sections on/off live, in front of the client. Settings persist in localStorage.
*/
const { useState, useEffect, createElement: h } = React;

const STORE_KEY = 'parra-tweaks';

function useTweaks(defaults) {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      return { ...defaults, ...saved };
    } catch (e) {
      return defaults;
    }
  });
  const setTweak = (key, val) =>
    setState(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch (e) {}
      return next;
    });
  return [state, setTweak];
}

function TweaksPanel({ title, children }) {
  const [open, setOpen] = useState(false);
  return h('div', { className: 'tw-wrap' },
    h('button', {
      className: 'tw-fab' + (open ? ' open' : ''),
      onClick: () => setOpen(o => !o),
      'aria-label': 'Personalizar',
      title: 'Personalizar'
    }, open ? '✕' : '🎨'),
    h('div', { className: 'tw-panel' + (open ? ' show' : '') },
      h('div', { className: 'tw-head' }, title),
      h('div', { className: 'tw-body' }, children),
      h('div', { className: 'tw-foot' }, 'Solo es una demo — los cambios quedan en tu navegador.')
    )
  );
}

function TweakSection({ title, children }) {
  return h('div', { className: 'tw-section' },
    h('div', { className: 'tw-sec-title' }, title),
    children
  );
}

function TweakColor({ label, value, onChange, options = [] }) {
  return h('div', { className: 'tw-row' },
    h('span', { className: 'tw-label' }, label),
    h('div', { className: 'tw-swatches' },
      options.map(c =>
        h('button', {
          key: c,
          className: 'tw-swatch' + (c.toLowerCase() === String(value).toLowerCase() ? ' on' : ''),
          style: { background: c },
          onClick: () => onChange(c),
          title: c
        })
      ),
      h('label', { className: 'tw-custom', title: 'Color personalizado' },
        h('input', {
          type: 'color',
          value: value,
          onChange: e => onChange(e.target.value)
        })
      )
    )
  );
}

function TweakToggle({ label, value, onChange }) {
  return h('div', { className: 'tw-row' },
    h('span', { className: 'tw-label' }, label),
    h('button', {
      className: 'tw-toggle' + (value ? ' on' : ''),
      onClick: () => onChange(!value),
      role: 'switch',
      'aria-checked': value
    }, h('span', { className: 'tw-knob' }))
  );
}

window.useTweaks = useTweaks;
window.TweaksPanel = TweaksPanel;
window.TweakSection = TweakSection;
window.TweakColor = TweakColor;
window.TweakToggle = TweakToggle;
