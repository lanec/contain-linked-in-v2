# LinkedIn Container

**Prevent LinkedIn from tracking your visits to other websites**

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
- Firefox 67+

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

## Attribution

This project is based on [Mozilla's Facebook Container](https://github.com/mozilla/contain-facebook) (v2.3.12), adapted for LinkedIn with comprehensive privacy protections.

### Key Features Inherited
- Container isolation technology
- Third-party tracker blocking
- Domain management system
- Multi-Account Containers integration
- Comprehensive test suite

### LinkedIn-Specific Adaptations
- 35+ LinkedIn domains covered (including CDNs, analytics, business products)
- LinkedIn tracking parameter removal (li_source, trk, trkInfo, etc.)
- Owned properties support (Lynda, SlideShare)
- LinkedIn-themed UI and branding

## Privacy Features

✅ **Container Isolation** - LinkedIn opens in dedicated container  
✅ **Tracker Blocking** - Blocks LinkedIn Insight Tag and px.ads.linkedin.com  
✅ **Cookie Isolation** - Prevents cross-site tracking via cookies  
✅ **Tracking Parameter Removal** - Strips li_source, trk, and other tracking params  
✅ **Service Worker Clearing** - Removes persistent tracking mechanisms  
✅ **Domain Management** - User control over which sites can access LinkedIn  

## Links

- [License](./LICENSE) - MPL-2.0
- [Contributing](./CONTRIBUTING.md)
- [Code Of Conduct](./CODE_OF_CONDUCT.md)
- [Planning Documentation](./Plan/) - Implementation strategy and analysis

## Support

Report issues on GitHub: https://github.com/lanec/contain-linkedin/issues

---

**This is an unofficial extension and is not affiliated with LinkedIn Corporation.**
