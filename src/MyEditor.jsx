import React, { PropTypes } from "react";
import Draft, { Editor, EditorState, convertFromRaw, RichUtils, Entity } from "draft-js";
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
      type: "my-custom-block"
    }, {
      text: ("This block is unstyled"),
      type: "unstyled"
    }],
  entityMap: {

  }
};

const blocks = convertFromRaw(rawContent);

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    const state = {
      editorState: EditorState.createWithContent(
        blocks
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
