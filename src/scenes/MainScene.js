import Phaser from 'phaser';

import backgroundImg from "../assets/images/background.png";

import playerSheet from '../assets/sprites/player/sheet.png';
import playerAtlas from '../assets/sprites/player/atlas.json';

import tilemap01 from '../assets/tilemaps/01.json';
import tileset01 from '../assets/tilesets/01.png';

import Background from '../components/Background';
import Player from '../components/Player';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload() {
    // Place your code to load assets here...
    this.load.image('background', backgroundImg);
    this.load.atlas('player', playerSheet, playerAtlas);

    // Loading in tilemap assets.
    this.load.tilemapTiledJSON('tilemap/01', tilemap01);
    this.load.image('tileset/01', tileset01);
  }

  /**
 * Draws debug graphics for layer.
 * 
 * @param {Phaser.Tilemaps.TilemapLayer} layer 
 */
  debugTilemapLayer(layer) {
    const gfx = this.add.graphics();

    layer.renderDebug(gfx, {
      collidingTileColor: null,
      tileColor: null,
      faceColor: new Phaser.Display.Color(255, 255, 0, 255)
    });
  }

  createTilemap() {
    const map = this.make.tilemap({ key: 'tilemap/01' });
    const tileset = map.addTilesetImage('01', 'tileset/01');
    const foreground = map.createLayer('foreground', tileset, 0, 0);

    // Tell Phaser to make every tile on 'foreground' layer collideable.
    foreground.setCollisionByExclusion([-1]);

    // this.debugTilemapLayer(foreground);

    return {
      map,
      foreground
    };
  }

  create() {
    // Place your code to initialize objects here...
    this.background = new Background(this);

    // Get input cursors.
    this.cursors = this.input.keyboard.createCursorKeys();

    // Place the player in the center of the camera.
    const x = this.cameras.main.centerX;
    const y = this.cameras.main.centerY;

    this.player = new Player(this, x, y);

    // Initialize our tilemap.
    this.tilemap = this.createTilemap();

    // Set the world bounds to be the dimensions of the tilemap.
    this.physics.world.setBounds(0, 0, this.tilemap.map.widthInPixels, this.tilemap.map.heightInPixels);

    // Setup collisions between the player and the tilemap.
    this.physics.add.collider(this.player, this.tilemap.foreground);

    // Tell the camera to follow the player and set world bounds to be tilemap dimensions.
    const { main } = this.cameras;
    main.startFollow(this.player);
    main.setBounds(0, 0, this.tilemap.map.widthInPixels, this.tilemap.map.heightInPixels);

    // Tell background to not scroll with the camera.
    this.background.setScrollFactor(0);
  }

  update() {
    // Place your code to update objects here...
    this.player.update(this.cursors);
  }
}
