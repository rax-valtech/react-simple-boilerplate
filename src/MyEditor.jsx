import React, { PropTypes } from "react";
import Draft, { Editor, EditorState, convertFromRaw, CompositeDecorator, Entity } from "draft-js";
import Immutable from "immutable";

class MyCustomBlock extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="my-custom-block">
        {this.props.children}
      </div>
    );
  }
}

MyCustomBlock.propTypes = {
  children: PropTypes.any
}

const blockRenderMap = Immutable.Map({
  "my-custom-block": {
    element: "section",
    wrapper: <MyCustomBlock />
  }
});

const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

const rawContent = {
  blocks: [
    {
      text: ("This block is unstyled"),
      type: "unstyled"
    }, {
      text: (
        "This is an 'immutable' entity: Superman. Deleting any " +
        "characters will delete the entire entity. Adding characters " +
        "will remove the entity from the range."
      ),
      type: "my-custom-block",
      inlineStyleRanges: [
        {
          length: 30,
          offset: 15,
          style: "BOLD"
        }
      ],
      entityRanges: [
        { key: 0, length: 40, offset: 0 }]
      },
    {
      text: ("This block is unstyled"),
      type: "unstyled"
    }],
  entityMap: {
    0: {
      data: {
        url: "http://www.idg.se"
      },
      type: "LINK",
      mutability: "mutable"
    }
  }
};

const blocks = convertFromRaw(rawContent);


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

const decorator = new CompositeDecorator([ LinkDecorator ]);

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    const state = {
      editorState: EditorState.createWithContent(
        blocks,
        decorator
      )
    };
    this.state = state;
    this.onChange = (editorState) => {
      let selection = editorState.getSelection();
      const anchorKey = selection.getAnchorKey();
      const currentContent = editorState.getCurrentContent();
      const currentBlock = currentContent.getBlockForKey(anchorKey);

      const start = selection.getStartOffset();
      const end = selection.getEndOffset();
      const selectedText = currentBlock.getText().slice(start, end);

      console.log(selectedText);

      const linkKey = currentBlock.getEntityAt(start);
      if(linkKey) {
        console.log(Entity.get(linkKey).getData());
      } else {
        console.log("no entity found");
      }

      this.setState({ editorState })
    };

    const firstBlockKey = Object.keys(blocks.get("blockMap").toJS())[0];
    const block = state.editorState.getCurrentContent().getBlockForKey(firstBlockKey);
    console.log(block);
  }
  handleKeyCommand(command) {
    console.log(command);
  }
  render() {
    const {editorState} = this.state;
    return <Editor
      editorState={editorState}
      onChange={this.onChange}
      blockRenderMap={extendedBlockRenderMap}
      handleKeyCommand={this.handleKeyCommand}
    />;
  }
}
