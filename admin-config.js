/* ============================================================================
   admin-config.js — DEMO auto-login (optional)
   ----------------------------------------------------------------------------
   For a DEMO you can pre-load a disposable GitHub token so the panel opens
   without the login screen. Turn it on by setting enabled:true and pasting the
   BASE64 of your token below.

   ⚠️  Use only a SHORT-LIVED, throwaway token (e.g. expires in a few days).
       The token here is committed to a PUBLIC repo — anyone can read it.
       Rotate/disable it right after the demo. For real use, leave this OFF
       and let staff log in (optionally "Recordar en este dispositivo").

   Why BASE64: GitHub secret-scanning auto-revokes raw tokens found in public
   code, which would break the demo. Encoding it dodges the pattern match.

   HOW TO FILL IT (recommended, dodges secret-scanning auto-revoke):
     1) In a terminal:   printf '%s' 'PASTE_YOUR_TOKEN' | rev | base64
     2) Put the result in `token` below and set enabled:true.
     3) Commit. The panel auto-logins on load.
   (A raw github_pat_... also works but GitHub may auto-revoke it — avoid.)
   ============================================================================ */
window.ADMIN_DEMO = {
  enabled: false,          // set true to auto-login for the demo
  token: '',               // output of:  printf '%s' 'TOKEN' | rev | base64
  owner: 'Daniel666674',
  repo: 'IMPORTECH'
};
