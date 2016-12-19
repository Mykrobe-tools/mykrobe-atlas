import React from 'react'
import { mount } from 'enzyme'
import FormInputRadio from './FormInputRadio'

describe('FormInputRadio component', () => {
  const name = 'loremIpsum'
  const title = 'Lorem Ipsum'
  const onChange = jest.fn()

  it('fires change events', () => {
    const selectedOption = 'dolorSitAmet'
    const options = [
      {value: 'lorem', label: 'Lorem'},
      {value: 'ipsum', label: 'Ipsum'},
      {value: 'dolorSitAmet', label: 'Dolor Sit Amet'}
    ]
    const component = mount(
      <FormInputRadio
        name={name}
        title={title}
        options={options}
        selectedOption={selectedOption}
        onChange={onChange} />
    )
    component.find('input[value="ipsum"]').simulate('change', {target: {checked: true}})
    expect(onChange).toBeCalled()
  })
})
