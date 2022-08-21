export const semanticOptions = [
  { value: "div" },
  { value: "section" },
  { value: "aside" },
  { value: "main" },
  { value: "header" },
  { value: "footer" },
  { value: "nav" },
];

const template = `
interface ContainerProps {
  children: JSX.Element|JSX.Element[],
  className?: string,
  style?: any,
  semantic?: ${semanticOptions.map((opt) => `'${opt.value}'`).join(" | ")},
}

const Container = (props: ContainerProps) => {
  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  )
}

<% if (it.prod) { %>
export default Container;
<% } else { %>
const _Container = (props: ContainerProps) => {
  return (
    <div style={{display: 'contents'}} onClick={() => console.log('click')}>
      <Container>
        {props.children}
      </Container>
    </div>
  )
}
export default _Container;
<% } %>

`;

export default {
  label: "Container",
  description: "",
  template,
  config: [
    //...spacingConfig, colorConfig, sizeConfig
    {
      label: "Semantic",
      fields: {
        semantic: {
          label: "Semantic",
          type: "ui:dropdown",
          values: semanticOptions,
          default: "div",
        },
      },
    },
  ],
};
