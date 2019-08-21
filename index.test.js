jest.mock('find-parent-dir');
jest.mock('fs');

var importer = require('./');
var mockFs = require('fs');
var mockFindParentDir = require('find-parent-dir');

describe('Importer', function() {
  beforeEach(function() {
    mockFs.existsSync.mockClear();
    mockFindParentDir.sync.mockReturnValue('MOCK_PARENT_DIR').mockClear();
  });

  test('resolves to node_modules directory when first character is ~', function() {
    mockFs.existsSync.mockReturnValueOnce(false).mockReturnValue(true);
    expect(importer('~my-module/foo', '')).toEqual({
      file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/foo'
    });
  });

  test('does nothing when the first character isnt a ~', function() {
    expect(importer('my-module', '')).toEqual(null);
  });
});
