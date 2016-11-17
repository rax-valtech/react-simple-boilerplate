import React, { PropTypes } from "react";
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

export default blockRenderMap;
