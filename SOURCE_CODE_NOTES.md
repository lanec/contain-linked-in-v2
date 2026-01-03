# LinkedIn Container - Source Code Notes

## For Mozilla Add-ons Reviewers

This source code package contains all files needed to build and review the LinkedIn Container extension.

## Minified Files

### psl.min.js
- **Purpose**: Public Suffix List library for domain parsing
- **Source**: https://github.com/lupomontero/psl
- **NPM Package**: `psl` (version in package.json)
- **Why Minified**: Third-party library included in minified form from npm package
- **Verification**: Compare with official npm package at https://www.npmjs.com/package/psl

### inpage-content.js
- **Purpose**: Content script injected into web pages
- **Source**: Located at `src/inpage-content.js` in this package
- **Why Flagged**: May appear minified due to compact code style
- **Verification**: This is the original source, not minified

## Build Instructions

This extension does **not** use a build process. Files are used as-is.

### To Test/Load:
```bash
npm install --legacy-peer-deps
npm run dev
```

### To Package:
```bash
cd src
zip -r ../extension.zip . -x "*.DS_Store"
```

## Dependencies

All dependencies are listed in `package.json` and are for development/testing only.
None are bundled into the final extension except:
- `psl.min.js` (copied from node_modules/psl/dist/psl.min.js)

## File Structure

```
src/                    # Extension source code
  manifest.json         # Extension manifest
  background.js         # Main background script
  panel.js/html/css     # Browser action popup
  content_script.js/css # Content scripts
  inpage-content.js/html # Injected notification UI
  _locales/             # 74 language translations
  img/                  # Icons and images
  psl.min.js            # Third-party library (minified)

test/                   # Test suite
  features/             # Unit tests
  functional/           # Functional tests

docs/                   # Documentation
CHANGELOG.md            # Version history
README.md               # Project documentation
package.json            # npm dependencies (dev only)
```

## Privacy & Data Collection

This extension collects **NO user data**.

As declared in `manifest.json`:
```json
"data_collection_permissions": {
  "required": ["none"]
}
```

## License

MPL-2.0 (same as original Facebook Container project)

## Attribution

Based on Mozilla's Facebook Container v2.3.12:
https://github.com/mozilla/contain-facebook

Adapted for LinkedIn with comprehensive privacy protections.

## Contact

- Developer: Lane Christiansen
- Repository: https://github.com/lanec/contain-linked-in-v2
- Issues: https://github.com/lanec/contain-linked-in-v2/issues
