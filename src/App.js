import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

let i,j,timerId, g=0;
const cellColour = ["#fff", "#888"];
let cellWidth = 10;
let cellHeight = 10;
let gridWidth = 70;
let gridHeight = 50;
let simSpeed = 500;
const generationPrev = [];
const generationThis = [];
const generationNext = [];

for(i=0; i<= gridHeight + 1; i++) {
  generationPrev[i] = [];
  generationThis[i] = [];
  generationNext[i] = [];
  
  for(j=0; j<=gridWidth+1; j++) {
    generationPrev[i][j] = 0;
    generationThis[i][j] = 0;
    generationNext[i][j] = 0;
  }
}

// seed generation
for(i=0; i<= gridHeight + 1; i++) {
  for(j=0; j<=gridWidth+1; j++) {
    // generationThis[4][6] = 1;
    // generationThis[5][5] = 1;
    // generationThis[5][6] = 1;
    // generationThis[5][7] = 1;
    // generationThis[6][5] = 1;
    // generationThis[6][6] = 1;
    // generationThis[6][7] = 1;
    generationThis[i][j] = Math.floor(Math.random() * 2);
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      run: true,
      pause: false,
      clear: false,
      smallSize: false,
      mediumSize: true,
      largeSize: false,
      slowSpeed: false,
      normalSpeed: true,
      fastSpeed: false
    }
    this.playPause = this.playPause.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
    this.changeSimSpeed = this.changeSimSpeed.bind(this);
    this.nextGen = this.nextGen.bind(this);
  }
  componentDidMount() {
    this.drawGrid();
    this.drawGeneration();
    timerId = setInterval( () => { this.nextGen() }, simSpeed);
  }

  componentWillUnmount() {
    clearInterval(timerId)
  }

  drawGrid() {
    let canvas = document.getElementById('gameboard');
    if(canvas.getContext) {
      canvas.width = cellWidth * gridWidth;
      canvas.height = cellHeight * gridHeight;
      let ctx = canvas.getContext('2d');
      for(i=1; i<=gridHeight; i++) {
        for(j=1; j<=gridWidth; j++) {
          this.drawCell(ctx, i, j);
        }
      }
    }
  }

  drawGeneration() {
    let canvas = document.getElementById('gameboard');
    if(canvas.getContext) {
      let ctx = canvas.getContext('2d');
      for(i=1; i<= gridHeight; i++) {
        for(j=1; j<= gridWidth; j++) {
          this.fillCell(ctx, i, j, cellColour[generationThis[i][j]]);
        }
      }
    }
    g++;
    document.getElementById('generation').innerHTML = g;
  }

  drawCell(ctx, i, j) {
    let x = (j-1) * cellWidth + 0.5;
    let y = (i-1) * cellHeight + 0.5;
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(x, y, cellWidth, cellHeight)
  }

  fillCell(ctx, i, j, color) {
    let x = (j-1) * cellWidth + 1;
    let y = (i-1) * cellHeight + 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellWidth-1, cellHeight-1);
  }

  countAdjacement(i, j) {
    var x = 0;
    x += generationThis[i-1][j-1];
    x += generationThis[i-1][j];
    x += generationThis[i-1][j+1];
    x += generationThis[i][j-1];
    x += generationThis[i][j+1];
    x += generationThis[i+1][j-1];
    x += generationThis[i+1][j];
    x += generationThis[i+1][j+1];
    return x;
  }
  
  nextGeneration() {
    for(i=1; i<= gridHeight; i++) {
      for(j=1; j<= gridWidth; j++) {
        let adjacement = this.countAdjacement(i, j);
        switch(generationThis[i][j]) {
          case 0: 
            if(adjacement === 3) {
              generationNext[i][j] = 1;
            }
            break;
          case 1:
            if((adjacement === 2) || (adjacement === 3)) {
              generationNext[i][j] = 1;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  copyGrids() {
    for(i = 1; i <= gridHeight; i++) {
      for(j = 1; j <= gridWidth; j++) {
        generationPrev[i][j] = generationThis[i][j];
        generationThis[i][j] = generationNext[i][j];
        generationNext[i][j] = 0;
      }
    }
  }

  nextGen() {
    this.nextGeneration();
    this.copyGrids();
    this.drawGeneration();
  }

  playPause(e) {
    this.componentWillUnmount();
    if(e.target.value === 'play') {
      this.setState({run: true, pause: false, clear: false});
      this.componentDidMount();
    } else {
      this.setState({run: false, pause: true, clear: false});
    }
  }

  changeBoardSize(e) {
    this.componentWillUnmount();
    if(e.target.value === 'small') {
      cellWidth = 15;
      cellHeight = 15;
      gridWidth = 50;
      gridHeight = 30;
      this.setState({smallSize: true, mediumSize: false, largeSize: false});
      this.componentDidMount();
    } else if(e.target.value === 'medium') {
      cellWidth = 10;
      cellHeight = 10;
      gridWidth = 70;
      gridHeight = 50;
      this.setState({smallSize: false, mediumSize: true, largeSize: false});
      this.componentDidMount();
    } else if(e.target.value === 'large') {
      cellWidth = 10;
      cellHeight = 10;
      gridWidth = 90;
      gridHeight = 50;
      this.setState({smallSize: false, mediumSize: false, largeSize: true});
      this.componentDidMount();
    }
  }

  changeSimSpeed(e) {
    this.componentWillUnmount();
    if(e.target.value === 'slow') {
      this.setState({slowSpeed: true, normalSpeed: false, fastSpeed: false});
      simSpeed = 1000;
      this.componentDidMount();
    } else if(e.target.value === 'normal') {
      this.setState({slowSpeed: false, normalSpeed: true, fastSpeed: false});
      simSpeed = 500;
      this.componentDidMount();
    } else if(e.target.value === 'fast') {
      this.setState({slowSpeed: false, normalSpeed: false, fastSpeed: true});
      simSpeed = 100;
      this.componentDidMount();
    }
  }

  clearBoard() {
    g = 0;
    document.getElementById('generation').innerHTML = g;
    this.setState({run: false, pause: false, clear: true});
    this.componentWillUnmount();
    for(i=0; i<= gridHeight + 1; i++) {
      generationPrev[i] = [];
      generationThis[i] = [];
      generationNext[i] = [];
      
      for(j=0; j<=gridWidth+1; j++) {
        generationPrev[i][j] = 0;
        generationThis[i][j] = 0;
        generationNext[i][j] = 0;
      }
    }
    this.drawGeneration();

    // seed generation
    for(i=0; i<= gridHeight + 1; i++) {
      for(j=0; j<=gridWidth+1; j++) {
        generationThis[i][j] = Math.floor(Math.random() * 2);
      }
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="row">
          <h2>Game Of Life</h2>
        </div>
        <canvas id="gameboard"></canvas>
        <div className="row">
          <p className=""> Generation : <span id="generation"></span>
            <button type="button" value="play" onClick={this.playPause} className={"btn-margin btn btn-default " + (this.state.run ? 'active' : 'inactive')}>Run</button>
            <button type="button" value="pause" onClick={this.playPause} className={"btn-margin btn btn-default " + (this.state.pause ? 'active' : 'inactive')}>Pause</button>
            <button type="button" onClick={this.clearBoard} className={"btn-margin btn btn-default " + (this.state.clear ? 'active' : 'inactive')}>Clear</button>
          </p>
        </div>
        <div className="row">
          <p className="">Board Size : 
            <button type="button" value="small" onClick={this.changeBoardSize} className={"btn-margin btn btn-default " + (this.state.smallSize ? 'active' : 'inactive')}>Size 50 x 30</button>
            <button type="button" value="medium" onClick={this.changeBoardSize} className={"btn-margin btn btn-default " + (this.state.mediumSize ? 'active' : 'inactive')}>Size: 70 x 50</button>
            <button type="button" value="large" onClick={this.changeBoardSize} className={"btn-margin btn btn-default " + (this.state.largeSize ? 'active' : 'inactive')}>Size: 90 x 50</button>
          </p>
        </div>
        <div className="row">
          <p className="">Sim Speed : 
            <button type="button" value="slow" onClick={this.changeSimSpeed} className={"btn-margin btn btn-default " + (this.state.slowSpeed ? 'active' : 'inactive')}>Slow</button>
            <button type="button" value="normal" onClick={this.changeSimSpeed} className={"btn-margin btn btn-default " + (this.state.normalSpeed ? 'active' : 'inactive')}>Normal</button>
            <button type="button" value="fast" onClick={this.changeSimSpeed} className={"btn-margin btn btn-default " + (this.state.fastSpeed ? 'active' : 'inactive')}>Fast</button>
          </p>
        </div>
        <div className="row text-center">
          <nav className="navbar navbar-inverse navbar-fixed-bottom">
            <div className="container-fluid">
              <p className="coded-by">*** By <a href="https://www.linkedin.com/in/kyawzintun/" target="_blank">KZT</a> ***</p>
            </div>
          </nav>
        </div>  
      </div>
    );
  }
}

export default App;
