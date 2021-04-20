import 'phaser';
import scoreSystem from '../score/API';
import Align from "../util/align";
export default class ScoreScene extends Phaser.Scene {
  constructor() {
    super('Score');
  }
  create() {
    fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/rtskQXlUNmHXvSs1xxhh/scores/')
      .then(res => res.json())
      .then(res => {
        res.result.forEach((user) => {
          console.log(user)
        })
      })
  }
};