import EditOnGithub from "./EditOnGithub";
import { Component, createEffect, createSignal, mergeProps } from "solid-js";

const DocSidebar: Component<{ headers: any[]; editHref: string }> = (p) => {
  const props = mergeProps({ headers: [] }, p);

  const [activeId, setActiveId] = createSignal<string>(undefined);

  createEffect(() => {
    let itemOffsets = [];
    const getItemOffsets = () => {
      const titles = document.querySelectorAll("article :is(h2, h3, h4)");
      itemOffsets = Array.from(titles).map((title) => ({
        id: title.id,
        topOffset: title.getBoundingClientRect().top + window.scrollY,
      }));
    };

    const onScroll = () => {
      const itemIndex = itemOffsets.findIndex(
        (item) => item.topOffset > window.scrollY + window.innerHeight / 3
      );
      if (itemIndex === 0) {
        setActiveId(undefined);
      } else if (itemIndex === -1) {
        setActiveId(itemOffsets[itemOffsets.length - 1].id);
      } else {
        setActiveId(itemOffsets[itemIndex - 1].id);
      }
    };

    getItemOffsets();
    window.addEventListener("resize", getItemOffsets);
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("resize", getItemOffsets);
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <nav>
      <div>
        <h4>Contents</h4>
        <ul>
          {props.headers
            .filter(({ depth }) => depth > 1 && depth < 5)
            .map((header) => (
              <li
                class={`header-link depth-${header.depth} ${
                  activeId === header.slug ? "active" : ""
                }`.trim()}
              >
                <a href={`#${header.slug}`}>{header.text}</a>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <EditOnGithub href={props.editHref} />
      </div>
    </nav>
  );
};

export default DocSidebar;
