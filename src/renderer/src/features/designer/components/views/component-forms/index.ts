import { Component } from 'solid-js'
import ButtonForm from './ButtonForm'
import ContainerForm from './ContainerForm'
import TextForm from './TextForm'

export const componentForms: Record<string, Component> = {
  container: ContainerForm,
  button: ButtonForm,
  text: TextForm
}
