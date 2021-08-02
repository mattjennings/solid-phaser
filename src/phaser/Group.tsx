import { Component, createContext, useContext } from "solid-js";

const GroupContext = createContext<Phaser.GameObjects.Group>();

export const useGroup = () => useContext(GroupContext);

const Group: Component<any> = (props) => {
  return (
    <GroupContext.Provider value={null}>{props.children}</GroupContext.Provider>
  );
};

export default Group;
