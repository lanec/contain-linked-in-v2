describe("Contain", () => {
  let webExtension, background, linkedinContainer;

  beforeEach(async () => {
    webExtension = await loadWebExtension();
    background = webExtension.background;
    linkedinContainer = webExtension.linkedinContainer;
  });

  describe("All requests stripped of liclid param", () => {
    const responses = {};
    beforeEach(async () => {
    });

    it("should redirect non-LinkedIn urls with liclid stripped", async () => {
      await background.browser.tabs._create({url: "https://github.com/?liclid=123"}, {responses});
      expect(background.browser.tabs.create).to.not.have.been.called;
      const [promise] = responses.webRequest.onBeforeRequest;
      const result = await promise;
      expect(result.redirectUrl).to.equal("https://github.com/");
    });

    it("should preserve other url params", async () => {
      await background.browser.tabs._create({url: "https://github.com/mozilla/contain-linkedin/issues?q=is%3Aissue+is%3Aopen+track&liclid=123"}, {responses});
      expect(background.browser.tabs.create).to.not.have.been.called;
      const [promise] = responses.webRequest.onBeforeRequest;
      const result = await promise;
      expect(result.redirectUrl).to.equal("https://github.com/mozilla/contain-linkedin/issues?q=is%3Aissue+is%3Aopen+track");
    });

    it("should redirect LinkedIn urls with liclid stripped", async () => {
      await background.browser.tabs._create({url: "https://www.linkedin.com/help/securitynotice?liclid=123"}, {responses});
      expect(background.browser.tabs.create).to.not.have.been.called;
      const [promise] = responses.webRequest.onBeforeRequest;
      const result = await promise;
      expect(result.redirectUrl).to.equal("https://www.linkedin.com/help/securitynotice");
    });
  });

  describe("Incoming requests to LinkedIn Domains outside of LinkedIn Container", () => {
    const responses = {};
    beforeEach(async () => {
      await background.browser.tabs._create({
        url: "https://www.linkedin.com"
      }, {
        responses
      });
    });

    it("should be reopened in LinkedIn Container", async () => {
      expect(background.browser.tabs.create).to.have.been.calledWithMatch({
        url: "https://www.linkedin.com",
        cookieStoreId: linkedinContainer.cookieStoreId
      });
    });

    it("should be canceled", async () => {
      const [promise] = responses.webRequest.onBeforeRequest;
      const result = await promise;
      expect(result.cancel).to.be.true;
    });
  });

  describe("Incoming requests to Non-LinkedIn Domains inside LinkedIn Container", () => {
    const responses = {};
    beforeEach(async () => {
      await background.browser.tabs._create({
        url: "https://example.com",
        cookieStoreId: linkedinContainer.cookieStoreId
      }, {
        responses
      });
    });

    it("should be reopened in Default Container", async () => {
      expect(background.browser.tabs.create).to.have.been.calledWithMatch({
        url: "https://example.com",
        cookieStoreId: "firefox-default"
      });
    });

    it("should be canceled", async () => {
      const [promise] = responses.webRequest.onBeforeRequest;
      const result = await promise;
      expect(result.cancel).to.be.true;
    });
  });


  describe("Incoming requests that don't start with http", () => {
    const responses = {};
    beforeEach(async () => {
      await background.browser.tabs._create({
        url: "ftp://www.linkedin.com"
      }, {
        responses
      });
    });

    it("should be ignored", async () => {
      expect(background.browser.tabs.create).to.not.have.been.called;
      const [promise] = responses.webRequest.onBeforeRequest;
      const result = await promise;
      expect(result).to.be.undefined;
    });
  });


  describe("Incoming requests that don't belong to a tab", () => {
    const responses = {};
    beforeEach(async () => {
      await background.browser.tabs._create({
        url: "https://www.linkedin.com",
        id: -1
      }, {
        responses
      });
    });

    it("should be ignored", async () => {
      expect(background.browser.tabs.create).to.not.have.been.called;
      const [promise] = responses.webRequest.onBeforeRequest;
      const result = await promise;
      expect(result).to.be.undefined;
    });
  });
});
