describe("Badging", () => {
  beforeEach(async () => {
    const badgesFixture = `moz-extension://${internalUUID}/fixtures/badges.html`;
    await geckodriver.get(badgesFixture);
  });

  it("should badge linkedin elements", async () => {
    await geckodriver.wait(until.elementLocated(
      By.className("lic-badge")
    ), 5000, "Should have badged the element");
  });
});