import React from 'react'
import { mount } from 'enzyme'
import FormTextarea from './FormTextarea'

describe('FormTextarea component', () => {
  const name = 'loremIpsum'
  const title = 'Lorem Ipsum'
  const rows = '10'
  const placeholder = 'Lorem Ipsum Dolor Sit Amet'
  const value = 'Dolor sit amet'
  const onChange = jest.fn()

  it('fires change events', () => {
    const component = mount(
      <FormTextarea
        name={name}
        title={title}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange} />
    )
    component.find('textarea').simulate('change', {target: {value: 'Lorem'}})
    expect(onChange).toBeCalled()
  })
})
