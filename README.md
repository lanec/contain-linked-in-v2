# LinkedIn Container

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![Firefox](https://img.shields.io/badge/Firefox-67%2B-orange.svg)](https://www.mozilla.org/firefox/)
[![Based on Facebook Container](https://img.shields.io/badge/Based%20on-Facebook%20Container%20v2.3.12-blue.svg)](https://github.com/mozilla/contain-facebook)

> **Prevent LinkedIn from tracking your visits to other websites**

A Firefox extension that isolates LinkedIn in a dedicated container to prevent cross-site tracking and protect your privacy. Based on Mozilla's [Facebook Container](https://github.com/mozilla/contain-facebook) with comprehensive adaptations for LinkedIn.

LinkedIn Container is an add-on you can install on Firefox to prevent LinkedIn from tracking your activity on other websites, so you can continue to use LinkedIn while protecting your privacy.

**Note:** To learn more about Containers in general, see [Firefox Multi-Account Containers](https://support.mozilla.org/kb/containers).

## How does LinkedIn Container work?

The Add-on keeps LinkedIn in a separate Container to prevent it from following your activity on other websites. When you first install the add-on, it signs you out of LinkedIn and deletes the cookies that LinkedIn uses to track you on other websites. 

Every time you visit LinkedIn, it will open in its own container, separate from other websites you visit. You can login to LinkedIn within its container. When browsing outside the container, LinkedIn won't be able to easily collect your browsing data and connect it to your LinkedIn identity.

## How do I enable LinkedIn Container?

We've made it easy to take steps to protect your privacy so you can go on with your day.

1. Install LinkedIn Container (see Installation section below). This will log you out of LinkedIn and delete the cookies it's been using to track you.
2. Open LinkedIn and use it like you normally would. Firefox will automatically switch to the LinkedIn Container tab for you.
3. If you click on a link to a page outside of LinkedIn or type in another website in the address bar, Firefox will load them outside of the LinkedIn Container

## How does this affect LinkedIn's features?

LinkedIn Container prevents LinkedIn from linking your activity on other websites to your LinkedIn identity. Therefore, the following will not work:

### "Sign in with LinkedIn" buttons on other websites

Because you are logged into LinkedIn only in the Container, "Sign in with LinkedIn" buttons on other websites will not work.

### LinkedIn share buttons and embedded content on other websites

Websites that allow you to share content to LinkedIn or display LinkedIn widgets will generally not work properly while you're logged into your contained LinkedIn account.

## Will this protect me from LinkedIn completely?

This add-on does not prevent LinkedIn from mishandling the data it already has or permitted others to obtain about you. LinkedIn still will have access to everything that you do while you are on linkedin.com, including your profile updates, posts, connections, messages, and any data you share with LinkedIn connected apps, etc.

Other ad networks may try to link your LinkedIn activities with your regular browsing. In addition to this add-on, there are other things you can do to maximize your protection, including changing your LinkedIn privacy settings, using Private Browsing and Tracking Protection, blocking third-party cookies, and/or using [Firefox Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/) extension to further limit tracking.

## How do I use Containers for other websites?

Good news! Containers aren't just for LinkedIn. You can use Containers to prevent websites from linking your identities across the Web by installing [Firefox Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/).

To learn more about how Multi-Account Containers work, see our support page at [Firefox Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/).

## Installation

### From Source (Development)

1. Clone this repository
2. `npm install --legacy-peer-deps`
3. `npm run dev` to run in Firefox
4. Or load as temporary add-on in Firefox: `about:debugging` → Load Temporary Add-on → select `manifest.json` from `src/` directory

### From Build

1. `npm run build`
2. Use the add-on zip file generated in the `web-ext-artifacts` folder
3. Install in Firefox via `about:addons` → Install Add-on From File

## Development

### Prerequisites
- Node.js 16.14.1+ (see `package.json` volta config)
- npm 8.5.0+
- **Firefox 140+** (required for modern data consent features)

### Commands

```bash
npm install --legacy-peer-deps   # Install dependencies
npm run dev                      # Run extension in Firefox
npm run lint                     # Run ESLint
npm test                         # Run all tests
npm run build                    # Build for production
```

### Testing
- `npm test` - Run full test suite (unit + functional + lint)
- `npm run test-watch` - Watch mode for unit tests
- `npm run test-functional` - Functional tests only
- `npm run coverage` - Generate coverage report

## Attribution & Acknowledgments

This project is a comprehensive fork and adaptation of [Mozilla's Facebook Container](https://github.com/mozilla/contain-facebook) (v2.3.12).

### Original Project
- **Source**: [Mozilla Facebook Container](https://github.com/mozilla/contain-facebook)
- **Authors**: Mozilla Corporation
- **License**: MPL-2.0 (maintained)
- **Version**: Based on v2.3.12

### Key Features Inherited from Facebook Container
✅ Container isolation technology  
✅ Third-party tracker blocking via webRequest API  
✅ Domain management and allowlist system  
✅ Multi-Account Containers (MAC) integration  
✅ Service worker clearing  
✅ Comprehensive test suite  

### LinkedIn-Specific Enhancements
🔹 **35+ LinkedIn domains** covered (core, CDN, tracking, business products, owned properties)  
🔹 **LinkedIn tracking parameter removal**: li_source, trk, trkInfo, lipi, licu, original_referer  
🔹 **Owned properties**: lynda.com, slideshare.net support  
🔹 **LinkedIn branding**: Custom UI with LinkedIn blue (#0A66C2)  
🔹 **74 locales**: Complete internationalization  

### Why Fork Facebook Container?

The Facebook Container provides a battle-tested, production-ready architecture for website isolation. Rather than building from scratch, this project leverages Mozilla's excellent work and adapts it specifically for LinkedIn's ecosystem, ensuring:
- Proven reliability and security
- Active maintenance patterns
- Community-tested privacy protection mechanisms
- Professional code quality and test coverage

## Privacy Features

✅ **Container Isolation** - LinkedIn opens in dedicated container  
✅ **Tracker Blocking** - Blocks LinkedIn Insight Tag and px.ads.linkedin.com  
✅ **Cookie Isolation** - Prevents cross-site tracking via cookies  
✅ **Tracking Parameter Removal** - Strips li_source, trk, and other tracking params  
✅ **Service Worker Clearing** - Removes persistent tracking mechanisms  
✅ **Domain Management** - User control over which sites can access LinkedIn  

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Support & Issues

- **Bug Reports**: [GitHub Issues](https://github.com/lanec/contain-linked-in-v2/issues)
- **Feature Requests**: [GitHub Issues](https://github.com/lanec/contain-linked-in-v2/issues)
- **Questions**: Check existing issues or open a new one

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

## Roadmap

- [ ] Publish to Firefox Add-ons (AMO)
- [ ] Custom LinkedIn-themed icons
- [ ] Enhanced content script selectors for LinkedIn UI elements
- [ ] Performance optimizations
- [ ] Additional domain discovery and refinement

---

## Legal

**Disclaimer**: This is an unofficial, open-source extension and is not affiliated with, endorsed by, or connected to LinkedIn Corporation or Microsoft Corporation.

**License**: MPL-2.0 (same as original Facebook Container)  
**Trademark Notice**: LinkedIn is a registered trademark of LinkedIn Corporation.
