import { Component } from 'solid-js'
import Button from './Button'
import Container from './Container'
import Text from './Text'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const components: Record<string, Component<any>> = {
  container: Container,
  button: Button,
  text: Text
}
