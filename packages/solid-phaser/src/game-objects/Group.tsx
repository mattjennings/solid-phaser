import { Component, createContext, useContext } from "solid-js";

const GroupContext = createContext<Phaser.GameObjects.Group>();

export const useGroup = () => useContext(GroupContext);

export const Group: Component<any> = (props) => {
  return (
    <GroupContext.Provider value={null}>{props.children}</GroupContext.Provider>
  );
};
