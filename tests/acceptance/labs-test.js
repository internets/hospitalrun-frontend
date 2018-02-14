import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | labs');

test('visiting /labs', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/labs');

    andThen(function() {
      assert.equal(currentURL(), '/labs');
      findWithAssert('a:contains(Create a new record?)');
      findWithAssert('button:contains(new lab)');
    });
  });
});

test('Adding a new lab request', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();
    visit('/labs');

    click('button:contains(new lab)');

    andThen(function() {
      assert.equal(currentURL(), '/labs/edit/new');
    });

    typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
    typeAheadFillIn('.test-lab-type', 'Chest Scan');
    fillIn('.test-result-input input', 'Chest is clear');
    fillIn('textarea', 'Dr test ordered another scan');
    click('button:contains(Add)');
    waitToAppear('.modal-dialog');

    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Lab Request Saved', 'Lab Request was saved successfully');
      findWithAssert('.patient-summary');
    });

    click('.modal-footer button:contains(Ok)');

    andThen(() => {
      assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
    });

    click('.panel-footer button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/labs');
      assert.equal(find('tr').length, 3, 'Two lab requests are displayed');
    });
  });
});

test('Marking a lab request as completed', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();
    visit('/labs/completed');

    andThen(() => {
      assert.equal(find('.alert-info').text().trim(), 'No completed items found.', 'No completed requests are displayed');
    });

    visit('/labs');
    click('button:contains(Edit)');
    click('button:contains(Complete)');
    waitToAppear('.modal-dialog');

    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Lab Request Completed', 'Lab Request was completed successfully');
    });

    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');
    visit('/labs/completed');

    andThen(() => {
      assert.equal(find('tr').length, 2, 'One completed request is displayed');
    });
  });
});

test('Lab with always included custom form', function(assert) {
  runWithPouchDump('custom-forms', function() {
    authenticateUser();
    visit('/labs');

    click('button:contains(new lab)');
    waitToAppear('h4');

    andThen(() => {
      assert.equal(find('h4').text(), 'Lab Form included', 'Default form is displayed');
      let formDiv = find('h4:contains(Lab Form included)').parent();

      assert.equal(find('label:contains(Form Header)', formDiv).length, 1, 'There is a form header');

      assert.equal(find('label:contains(Form Dropdown)', formDiv).length, 1, 'There is a dropdown header');
      assert.equal(find('select', formDiv).length, 1, 'There is a dropdown');
      assert.equal(find('option', formDiv).length, 2, 'There are options');

      assert.equal(find('label:contains(Form Checkbox)', formDiv).length, 1, 'There is a checkbox header');
      assert.equal(find('input[type=checkbox]', formDiv).length, 2, 'There are checkboxes');

      assert.equal(find('label:contains(Form large text)', formDiv).length, 1, 'There is a textarea header');
      assert.equal(find('textarea', formDiv).length, 1, 'There is a textarea');

      assert.equal(find('label:contains(Form radio)', formDiv).length, 1, 'There is a radio header');
      assert.equal(find('input[type=radio]', formDiv).length, 3, 'There are radios');
      assert.equal(find('label:contains(other option)', formDiv).length, 1, 'There is the other option radio');
      assert.equal(find('label:contains(other option) input[type=text]', formDiv).length, 1, 'There is the other option input');

      assert.equal(find('label:contains(Form simple text)', formDiv).length, 1, 'There is a text header');
      assert.equal(find('label:contains(Form simple text)+input[type=text]', formDiv).length, 1, 'There is a text input');
    });

    andThen(() => {
      typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      typeAheadFillIn('.test-lab-type', 'Chest Scan');
      fillIn('.test-result-input input', 'Chest is clear');
      fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');

      select('h4:contains(Lab Form included)+div select', 'Value 2');
      click('h4:contains(Lab Form included)+div input[type=checkbox]:last');
      click('h4:contains(Lab Form included)+div input[type=radio]:nth(1)');
      fillIn('h4:contains(Lab Form included)+div textarea', 'Large text for the form ' + 'Lab Form included');
      fillIn('h4:contains(Lab Form included)+div label:contains(Form simple text)+input[type=text]', 'Small text for the form ' + 'Lab Form included');

      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });

    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Lab Request Saved', 'Lab Request was saved successfully');
      findWithAssert('.patient-summary');
    });

    click('.modal-footer button:contains(Ok)');

    andThen(() => {
      assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
    });

    click('.panel-footer button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/labs');
      assert.equal(find('tr').length, 3, 'Two lab requests are displayed');
    });

    click('tr:last');
    waitToAppear('h4');

    andThen(() => {
      let formDiv = find('h4:contains(Lab Form included)').parent();
      //assert.equal(find('*:contains(Lennex Zinyando)').length, 1, 'There is patient');
      assert.equal(find('.test-result-input input').val(), 'Chest is clear', 'There is result');
      assert.equal(find('.js-lab-notes textarea').val(), 'Dr test ordered another scan', 'There is note');
      assert.equal(find('select', formDiv).val(), 'Value 2', 'There is value in select');
      assert.ok(find('input[type=checkbox]:last', formDiv).is(':checked'), 'There is value in checkbox');
      assert.equal(find('input:radio:checked', formDiv).val(), 'radio 2', 'There is value in radio');
      assert.equal(find('textarea', formDiv).val(), 'Large text for the form ' + 'Lab Form included', 'There is value in textarea');
      assert.equal(find('label:contains(Form simple text)+input[type=text]', formDiv).val(), 'Small text for the form ' + 'Lab Form included', 'There is value in the input');
    });
  });
});
