import React from "react";
import Draft, { Editor, EditorState, convertFromRaw, CompositeDecorator, Entity } from "draft-js";

import LinkDecorator from "./Decorator.jsx";
import customBlockRenderMap from "./customBlockRenderMap.js";

const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(customBlockRenderMap);

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
          offset: 40,
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
const decorator = new CompositeDecorator([LinkDecorator]);

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
  }

  onChange(editorState) {
    let selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    const selectedText = currentBlock.getText().slice(start, end);

    console.log(selectedText);

    const linkKey = currentBlock.getEntityAt(start);
    if (linkKey) {
      console.log(Entity.get(linkKey).getData());
    } else {
      console.log("no entity found");
    }

    this.setState({ editorState })
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
