import Ember from 'ember';

Ember.Test.registerAsyncHelper('checkCustomFormIsDisplayed', function(app, assert, header) {
  waitToAppear(`h4:contains(${header})`);

  andThen(() => {
    assert.equal(find(`h4:contains(${header})`).length, 1, `Form ${header} is displayed`);

    let formDiv = find(`h4:contains(${header}) + .js-custom-form`);

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
});

Ember.Test.registerAsyncHelper('fillCustomForm', function(app, header) {
  let formSelector = `h4:contains(${header}) + .js-custom-form`;
  select(`${formSelector} select`, 'Value 2');
  click(`${formSelector} input[type=checkbox]:last`);
  click(`${formSelector} input[type=radio]:nth(1)`);
  fillIn(`${formSelector} textarea`, `Large text for the form ${header}`);
  fillIn(`${formSelector} label:contains(Form simple text)+input[type=text]`, `Small text for the form ${header}`);
});

Ember.Test.registerAsyncHelper('checkCustomFormIsFilled', function(app, assert, header) {
  waitToAppear(`h4:contains(${header})`);

  andThen(() => {
    let formDiv = find(`h4:contains(${header}) + .js-custom-form`);

    assert.equal(find('label:contains(Form Header)', formDiv).length, 1, 'There is a form header');
    assert.equal(find('select', formDiv).val(), 'Value 2', 'There is value in select');
    assert.ok(find('input[type=checkbox]:last', formDiv).is(':checked'), 'There is value in checkbox');
    assert.equal(find('input:radio:checked', formDiv).val(), 'radio 2', 'There is value in radio');
    assert.equal(find('textarea', formDiv).val(), `Large text for the form ${header}`, 'There is value in textarea');
    assert.equal(find('label:contains(Form simple text)+input[type=text]', formDiv).val(), `Small text for the form ${header}`, 'There is value in the input');
  });
});

Ember.Test.registerAsyncHelper('checkCustomFormIsFilledAndReadonly', function(app, assert, header) {
  waitToAppear(`h4:contains(${header})`);

  andThen(() => {
    let formDiv = find(`h4:contains(${header}) + .js-custom-form`);

    assert.equal(find('label:contains(Form Header)', formDiv).length, 1, 'There is a form header');
    assert.equal(find('p:contains(Value 2)', formDiv).length, 1, 'There is text from select');
    assert.equal(find('p:contains(radio 2)', formDiv).length, 1, 'There is text from radio');
    assert.ok(find('input[type=checkbox]:last', formDiv).is(':checked'), 'There is value in checkbox');
    assert.equal(find(`p:contains(Large text for the form ${header})`, formDiv).length, 1, 'There is text from textarea');
    assert.equal(find(`p:contains(Small text for the form ${header})`, formDiv).length, 1, 'There is text from input');
  });
});
