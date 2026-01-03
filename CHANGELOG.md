# Changelog

All notable changes to LinkedIn Container will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-03

### Added
- **Complete rewrite** based on Mozilla's Facebook Container v2.3.12
- **35+ LinkedIn domains** covered including:
  - Core domains (linkedin.com, www.linkedin.com)
  - CDN domains (licdn.com, static.licdn.com, media.licdn.com)
  - Tracking domains (linkedin-ei.com, px.ads.linkedin.com)
  - Business products (sales.linkedin.com, learning.linkedin.com, recruiter.linkedin.com)
  - Owned properties (lynda.com, slideshare.net)
- **LinkedIn tracking parameter removal**: Strips li_source, trk, trkInfo, lipi, licu, original_referer
- **Container isolation**: Dedicated LinkedIn container with blue branding (#0A66C2)
- **Tracker blocking**: Blocks LinkedIn Insight Tag and third-party tracking pixels
- **Domain management**: User control over which sites can access LinkedIn identity
- **Multi-Account Containers integration**: Works seamlessly with Firefox MAC addon
- **74 localized translations**: Complete internationalization support
- **Comprehensive test suite**: Unit tests, functional tests, and integration tests
- **Modern build system**: Uses web-ext with ESLint and automated testing

### Changed
- **Architecture**: Migrated from simple 140-line script to production-grade 720-line implementation
- **UI/UX**: Complete LinkedIn branding with custom colors and icons
- **Privacy features**: Enhanced from basic containment to advanced tracker blocking
- **Documentation**: Professional README with installation, development, and contribution guides

### Technical Details
- Minimum Firefox version: 67.0
- Uses contextualIdentities API for container management
- Implements webRequest blocking for tracker prevention
- Service worker clearing for persistent tracking removal
- Compatible with Firefox Multi-Account Containers and Firefox Relay

---

## [1.2.5] - Previous Version (Original Implementation)

The previous version was a fork of contain-linkedin with basic functionality.
This v1.0.0 represents a complete rewrite with enterprise-grade features and privacy protections.

---

## Attribution

This project is based on [Mozilla's Facebook Container](https://github.com/mozilla/contain-facebook) (v2.3.12),
extensively adapted for LinkedIn with comprehensive privacy protections and domain coverage.

**Original Facebook Container Authors**: Mozilla Corporation
**License**: MPL-2.0 (maintained from original)
**LinkedIn Container Adaptation**: Lane Christiansen
