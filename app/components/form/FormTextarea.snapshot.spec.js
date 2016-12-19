import React from 'react'
import renderer from 'react-test-renderer'
import FormTextarea from './FormTextarea'

describe('FormTextarea component snapshot', () => {
  const name = 'loremIpsum'
  const title = 'Lorem Ipsum'
  const rows = '10'
  const placeholder = 'Lorem Ipsum Dolor Sit Amet'
  const value = 'Dolor sit amet'
  const onChange = jest.fn()

  it('renders correctly', () => {
    const component = renderer.create(
      <FormTextarea
        name={name}
        title={title}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
