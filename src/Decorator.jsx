import { Entity } from "draft-js";
import React, { PropTypes } from "react";

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === "LINK"
      );
    },
    callback
  );
}

export const LinkDecoratorComponent = (props) => (
  <a href={ Entity.get(props.entityKey).data.url }>
    { props.children }
  </a>
);

LinkDecoratorComponent.propTypes = {
  children: PropTypes.any,
  entityKey: PropTypes.any
}

const LinkDecorator = {
  strategy: findLinkEntities,
  component: LinkDecoratorComponent
};

export default LinkDecorator;
