import React from "react"
import Isomer,
       { Point,
         Shape,
         Color,
         Path
       } from "isomer";

class Blocks extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array,
    isoConfig: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  static defaultProps = {
    isoConfig: {}
  }

  constructor(props) {
    super(props)

    /* Default Isomer config */
    const defaultIsoConfig = {
      basicUnit: 0.75,
      width: 1,
      borderWidth: -0.2,
      baseHeight: 0.0,
      centerPoint: Point(0, 0, 0),
      rotation: (Math.PI / 12),
      scale: 1,
      translate: 0,
      offset: 2,
      groundRadius: 2,
      gridColor: new Color(50, 50, 50)
    }

    this.config = {...defaultIsoConfig, ...props.isoConfig}

    this.colorMap = {
      Red: [209, 0, 0],
      Orange: [255, 102, 34],
      Yellow: [255, 218, 33],
      Green: [51, 221, 0],
      Blue: [17, 51, 204],
      Black: [10, 10, 10],
      White: [255, 255, 240],
      Pink: [255, 20, 147],
      Brown: [139, 69, 19],
      Anchor: [0, 160, 176],
      Gray: [144, 144, 144]
    }

    this.state = { iso: null, rotational: -1 }
  }

  componentDidMount() {
    const iso =  new Isomer(this.refs.blocksCanvas);
    this.setState({ iso: iso });
  }

  componentDidUpdate() {
    this.state.iso.canvas.clear()
    this.renderGrid()
    this.renderBlocks()
  }

  renderGrid() {
    const { basicUnit, scale, offset, groundColor, groundRadius, rotation, centerPoint } = this.config;

    const unit = basicUnit * scale;
    const gridwidth = basicUnit * scale
    const groundwidth = 2 * groundRadius + 1;
    for (let x = 0; x < groundwidth + 1; x++) {
      this.state.iso.add(new Path([
      	new Point(x*unit, 0, 0),
      	new Point(x*unit, groundwidth *unit, 0),
      	new Point(x*unit, 0, 0)
      ])
      .translate(gridwidth*offset, gridwidth*offset, 0)
      .rotateZ(centerPoint, rotation),
      groundColor
      );

      const y = x;
      this.state.iso.add(new Path([
      	new Point(0, y*unit, 0),
      	new Point(groundwidth*unit, y*unit, 0),
      	new Point(0, y*unit, 0)
      ])
      .translate(gridwidth*offset, gridwidth*offset, 0)
      .rotateZ(centerPoint, rotation),
      groundColor
      );
    }
  }

  renderBlocks() {
    const { width, scale, translate, basicUnit } = this.config

    const blocks = this.sortBlocks(this.props.blocks.map((b) => {
      let x = b.x;
      let y = b.y;

      switch (this.state.rotational) {
        case -1:
          x = b.x;
          y = b.y;
          break;
        case -2:
          x = b.y;
          y = width - 1 - b.x;
          break;
        case 1:
          x = width - 1 - b.y;
          y = b.x;
          break;
        case 2:
          x = width - 1 - b.x;
          y = width - 1 - b.y;
          break;
        default:
      }

      return { ...b, x: x, y: y };
    }));

    const selected = blocks.filter((b) => b.names && b.names.includes("S"));
    for (const block of blocks) {
      let selectedBlockYes = false;
      const color = this.colorMap[block.color];
      let blockColor = new Color();
      if (block.names && block.names.includes("_new")) {
        blockColor = new Color(color[0], color[1], color[2], 0.2);
      } else {
        blockColor = new Color(color[0], color[1], color[2], 0.88);
        if (selected.length > 0 && selected.includes(block) && block.color !== "Anchor") {
          // blockColor = new Color(color[0], color[1], color[2], 0);
          selectedBlockYes = true;
        }
      }
      if (block.color === "Anchor") {
        this.state.iso.add(this.makeBlock(block.x, block.y, -0.01, scale, translate, 0.01), this.darken(blockColor));
      } else {
        this.state.iso.add(this.makeBlock(block.x, block.y, block.z), blockColor);
      }

      if (selectedBlockYes) {
        this.state.iso.add(this.makeBlock(block.x, block.y, block.z, basicUnit, true), new Color(0, 160, 176, 0.125));
      }
    }
  }

  darken(color) {
    return new Color(this.darkenValue(color.r), this.darkenValue(color.g), this.darkenValue(color.b), color.a);
  }

  darkenValue(value, factor = 0.5) {
    const graystandard = 128;
    return factor*graystandard + (1-factor)*value;
  }

  makeBlock(x, y, z, unitWidth = this.config.basicUnit, highlighted = false) {
    const { scale, groundRadius, offset, rotation, centerPoint, borderWidth, baseHeight, basicUnit } = this.config

    const gridWidth = unitWidth * scale
    const shifter = highlighted ? unitWidth * 0.4 : 0;

    return Shape.Prism(
      Point((x + (x * borderWidth)) * scale + (shifter / 2),
            (y + (y * borderWidth)) * scale + (shifter / 2),
            (z + baseHeight + (borderWidth * z)) * scale + (shifter / 2)
           ),
      basicUnit * scale - shifter, basicUnit * scale - shifter, basicUnit * scale - shifter
    )
      .translate((offset+groundRadius)*gridWidth, (offset+groundRadius)*gridWidth, 0)
      .rotateZ(centerPoint, rotation);
  }

  sortBlocks(blocks) {
    return blocks.sort((a, b) => {
      if (a.z > b.z) {
        return 1;
      } else if (a.z < b.z) {
        return -1;
      }

      if (a.x > b.x) {
        return -1;
      } else if (a.x < b.x) {
        return 1;
      }

      if (a.y > b.y) {
        return -1;
      } else if (a.y < b.y) {
        return 1;
      }

      return 0;
    });
  }

  render() {
    return (
      <canvas className="Blocks" ref="blocksCanvas" width={this.props.width} height={this.props.height} />
    )
  }
}

export default Blocks
