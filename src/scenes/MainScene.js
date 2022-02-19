import Phaser from 'phaser';

import gearImg from '../assets/images/gear.png'
import backgroundImg from "../assets/images/background.png";

import playerSheet from '../assets/sprites/player/sheet.png';
import playerAtlas from '../assets/sprites/player/atlas.json';

import enemySheet from '../assets/sprites/enemy/sheet.png';
import enemyAtlas from '../assets/sprites/enemy/atlas.json';

import tilemap01 from '../assets/tilemaps/01.json';
import tileset01 from '../assets/tilesets/01.png';

import Background from '../components/Background';
import Player from '../components/Player';
import Enemy from '../components/Enemy';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MainScene"
    });

    this.score = 0;
  }

  preload() {
    // Place your code to load assets here...
    this.load.image('background', backgroundImg);
    this.load.image('gear', gearImg);

    this.load.atlas('player', playerSheet, playerAtlas);
    this.load.atlas('enemy', enemySheet, enemyAtlas);

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
    const enemyCollider = map.createLayer('enemy_collider');

    // Tell Phaser to make every tile on 'foreground' layer collideable.
    foreground.setCollisionByExclusion([-1]);
    enemyCollider.setCollisionByExclusion([-1]);

    // Get a list of enemy positions.
    const enemies = map.getObjectLayer('objects')
      .objects
      .filter(object => object.name === "spawn_enemy")
      .map(object => ({ x: object.x + object.width * 0.5, y: object.y - object.height * 0.5 }));

    // Get the player position.
    const player = map.getObjectLayer('objects')
      .objects
      .filter(object => object.name === "spawn_player")
      .map(object => ({ x: object.x + object.width * 0.5, y: object.y - object.height * 0.5 }));

    // this.debugTilemapLayer(foreground);

    return {
      map,
      foreground,
      enemies,
      enemyCollider,
      player: player.length > 0 ? player[0] : undefined
    };
  }

  createCollisions() {
    this.physics.add.collider(this.player, this.tilemap.foreground);
    this.physics.add.collider(this.collectibles, this.tilemap.foreground);
    this.physics.add.overlap(this.collectibles, this.player, (player, star) => { this.score += 10; star.disableBody(true, true); });

    this.physics.add.collider(this.enemies, this.tilemap.foreground);
    this.physics.add.collider(this.enemies, this.tilemap.enemyCollider, (enemy, collider) => { enemy.turnAround(); })
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

    // Place 11 collectibles.
    this.collectibles = this.physics.add.group({
      key: 'gear',
      setScale: { x: 0.4, y: 0.4 },
      repeat: 11,
      setXY: { x: 64, y: 0, stepX: 70 }
    });

    this.collectibles.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Place enemies.
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true
    });

    this.tilemap.enemies.forEach((object) => {
      this.enemies.create(object.x, object.y, 'enemy', 0, true, true);
    });

    // Setup collisions.
    this.createCollisions();

    // Set the world bounds to be the dimensions of the tilemap.
    this.physics.world.setBounds(0, 0, this.tilemap.map.widthInPixels, this.tilemap.map.heightInPixels);

    // Tell the camera to follow the player and set world bounds to be tilemap dimensions.
    const { main } = this.cameras;
    main.startFollow(this.player);
    main.setBounds(0, 0, this.tilemap.map.widthInPixels, this.tilemap.map.heightInPixels);

    // Tell background to not scroll with the camera.
    this.background.setScrollFactor(0);

    // Create score text.
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fontFamily: 'VT323', fill: '#fff' });
    this.scoreText.setScrollFactor(0);
  }

  update() {
    // Place your code to update objects here...
    this.player.update(this.cursors);
    this.scoreText.setText('Score: ' + this.score);
  }
}
