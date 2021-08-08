import type { Props } from "react-docgen-typescript";

export default function PropsTable(p: { props: Props }) {
  const hasDescription = Object.keys(p.props).some((name: string) => {
    const description = p.props?.[`${name}.description`];
    return !!description;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Property</th>
          <th class="hidden sm:block">Type</th>
          <th>Required</th>
          <th>Default</th>

          {hasDescription && <th class="w-[40%]">Description</th>}
        </tr>
      </thead>

      <tbody>
        {Object.keys(p.props).map((name) => {
          const prop = p.props[name];

          if (!prop.type) return null;
          return (
            <tr>
              <td>{name}</td>
              <td class="hidden sm:block">{prop.type.value}</td>
              <td>{String(prop.required)}</td>
              {!prop.defaultValue ? (
                <td>
                  <em>-</em>
                </td>
              ) : (
                <td>
                  {prop.defaultValue.value === "''" ? (
                    <em>[Empty String]</em>
                  ) : (
                    prop.defaultValue &&
                    prop.defaultValue.value.replace(/'/g, "")
                  )}
                </td>
              )}
              {hasDescription && (
                <td>{prop.description && prop.description}</td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
