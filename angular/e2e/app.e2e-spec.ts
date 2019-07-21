import { ManufactureSysTemplatePage } from './app.po';

describe('ManufactureSys App', function() {
  let page: ManufactureSysTemplatePage;

  beforeEach(() => {
    page = new ManufactureSysTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
