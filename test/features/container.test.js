describe("Container", () => {
  let webExtension, background;

  describe("Add-on initializes", () => {
    describe("No Container with name LinkedIn exists", () => {
      beforeEach(async () => {
        webExtension = await loadWebExtension();
        background = webExtension.background;
      });

      it("should create a new LinkedIn Container", () => {
        expect(background.browser.contextualIdentities.create).to.have.been.calledWithMatch({
          name: "LinkedIn"
        });
      });
    });

    describe("Container with name LinkedIn already exists", () => {
      beforeEach(async () => {
        webExtension = await loadWebExtension({
          async beforeParse(window) {
            await window.browser.contextualIdentities._create({
              name: "LinkedIn"
            });
          }
        });
        background = webExtension.background;
      });

      it("should not create a new Container", () => {
        expect(background.browser.contextualIdentities.create).to.not.have.been.called;
      });
    });
  });
});
