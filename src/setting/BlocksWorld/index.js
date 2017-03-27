import React from "react"
import { sortBlocks } from "helpers/blocks"
import THREE from "three"

function stateIncludes(state, obj) {
  for (const c of state) {
    if (c.x === obj.x &&
      c.y === obj.y &&
      c.z === obj.z &&
      c.color === obj.color) {
      return true;
    }
  }
  return false;
}


/* Will return the state with the "_new" name attached to the difference between
 * the prev state and the next state */
export const computeDiff = (prev, next) => {
  const difference = next.filter(c => !stateIncludes(prev, c))
  const intersection = next.filter(c => stateIncludes(prev, c))

  return difference.map((c) => (Object.assign({}, c, { names: [...c.names, "_new"] })))
    .concat(intersection)
}

/* Will return true if the two states are equal; false otherwise */
export const computeEquality = (struct1, struct2) => {
  const a = sortBlocks(struct1).filter((b) => b.color !== "Anchor");
  const b = sortBlocks(struct2).filter((b) => b.color !== "Anchor");

  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i].x !== b[i].x ||
      a[i].y !== b[i].y ||
      a[i].z !== b[i].z ||
      a[i].color !== b[i].color) {
      return false;
    }
  }

  return true;
}

class Blocks extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  constructor(props) {
    super(props)

    this.camera = null
    this.scene = null
    this.renderer = null
    this.mesh = null

    this.VIEW_ANGLE = 45
    this.FAR = 10000
    this.NEAR = 1

    this.STEP = 50
    this.GRID_SIZE = 500
    this.BORDER = 5
    this.SELECTOR = 25

    this.objects = []

    this._onWindowResize = () => this.onWindowResize()

    this.colorMap = {
      Red: 0xd10000,
      Orange: 0xff6622,
      Yellow: 0xffda21,
      Green: 0x33dd00,
      Blue: 0x1133cc,
      Black: 0x0a0a0a,
      White: 0xfffff0,
      Pink: 0xff1493,
      Brown: 0x8b4513,
      Anchor: 0x000000,
      Fake: 0xffffff,
      Gray: 0x909090
    }
  }

  componentDidMount() {
    /* Create renderer */
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    /* Assign DOM Element */
    const container = this.refs.blocks

    /* Set the camera position */
    this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.props.width / this.props.height, this.NEAR, this.FAR);
		this.camera.position.set( 500, 800, 1300 );
		this.camera.lookAt( new THREE.Vector3() );

    /* Create the scene */
    this.scene = new THREE.Scene();

    /* Draw Grid */
    var geometry = new THREE.Geometry();
    for ( var i = - this.GRID_SIZE; i <= this.GRID_SIZE; i += this.STEP ) {
      geometry.vertices.push( new THREE.Vector3( - this.GRID_SIZE, 0, i ) );
      geometry.vertices.push( new THREE.Vector3(   this.GRID_SIZE, 0, i ) );
      geometry.vertices.push( new THREE.Vector3( i, 0, - this.GRID_SIZE ) );
      geometry.vertices.push( new THREE.Vector3( i, 0,   this.GRID_SIZE ) );
    }
    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );
    var line = new THREE.LineSegments( geometry, material );
    this.scene.add( line );

    // Define the raycaster
    // const raycaster = new THREE.Raycaster();
    // const mouse = new THREE.Vector2();
    // var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
    // geometry.rotateX( - Math.PI / 2 );
    // const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    // this.scene.add( plane );

    /* Render the element */
    container.appendChild(this.renderer.domElement);

    /* Lights */
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    this.scene.add( ambientLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    this.scene.add( directionalLight );

    /* Define the renderer */
    this.renderer.setClearColor( 0xf0f0f0 )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize(this.props.width, this.props.height)

    /* Render :) */
    this.renderScene()

    this.renderBlocks()

    window.addEventListener("resize", this._onWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._onWindowResize)
  }

  componentDidUpdate() {
    this.renderBlocks()
  }
  
  addBlock(x, y, z, color, transparent, selector) {
    let hexColor = this.colorMap[color]
    if (!hexColor)
      hexColor = parseInt(color, 16)
    
    /* Define the cube material */
    const cubeGeo = !selector ? new THREE.BoxGeometry(this.STEP - this.BORDER, this.STEP - this.BORDER, this.STEP - this.BORDER) : new THREE.BoxGeometry(this.SELECTOR, this.SELECTOR, this.SELECTOR)
    const cubeMaterial = new THREE.MeshBasicMaterial( { color: hexColor, opacity: (transparent && !selector) ? 0.5 : 0.9, transparent: true } )

    /* Create the Voxel */
    const voxel = new THREE.Mesh(cubeGeo, cubeMaterial)
    if (selector) {
      voxel.renderOrder = 0
    } else {
      voxel.renderOrder = 1
    }

    /* Set the position */
    const position = new THREE.Vector3(-y * this.STEP, z * this.STEP, -x * this.STEP)

    /* Place the voxel */
    voxel.position.copy(position)
    voxel.position.divideScalar(this.STEP).floor().multiplyScalar(this.STEP).addScalar((this.STEP / 2) + (this.BORDER / 2))

    /* Add the voxel to the scene */
    this.scene.add(voxel)

    /* Keep track of the voxel for future use */
    this.objects.push(voxel)
  }

  renderBlocks() {
    /* Remove all preexisting blocks from the scene to clear it */
    for (const object of this.objects) {
      this.scene.remove(object)
    }
    this.objects = []

    /* Add the blocks to the scene */
    for (const block of this.props.blocks) {
      if (block.color === "Fake") {
        /* add selector floating */
        this.addBlock(block.x, block.y, block.z, "Anchor", true, true)
      } else {
        /* add regular block */
        this.addBlock(block.x, block.y, block.z, block.color, (block.names && block.names.includes("_new")), false)
        if (block.names && block.names.includes("S")) {
          /* add selector inside of block */
          this.addBlock(block.x, block.y, block.z, "Anchor", true, true)
        }
      }
    }

    /* And render :) */
    this.renderScene()
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  onWindowResize() {
    this.camera.aspect = this.props.width / this.props.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( this.props.width, this.props.height );
  }

  render() {

    return (
      <div id="blocks" ref="blocks"></div>
    )
  }
}

export default Blocks