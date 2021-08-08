export default function InnerHTML(props: { content: string }) {
  return <div innerHTML={props.content} />;
}
