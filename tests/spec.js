describe('Flickr API App', function() {
  it('Should load and compile correct template', function() {
    browser.get('http://local.dev/angular-flickr-app');
    element(by.css('.item._link')).click();

    var content = element(by.id('forTesting')).getText();
    expect(content).toMatch(/Detail Page/);

  });

  it('Should return correct search results', function() {
    browser.get('http://local.dev/angular-flickr-app');
    element(by.model('searchCriteria.tags')).sendKeys('edward');

    element(by.id('formSubmit')).click();
    expect(element(by.id('resultTitle')).getText()).toEqual('Recent Uploads tagged edward');
  });

});