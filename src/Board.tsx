import { nanoid } from "nanoid";
import React from "react";
import { Cell } from "./Cell";
import _ from "lodash";

interface Props {
  rows: Number;
  columns: Number;
}

interface State {
  grid: any;
}

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export class Board extends React.Component<Props, State> {
  public running: Boolean = false
  constructor(props: Props) {
    super(props);
    this.state = {
      grid: [],
    };
  }

  makeFreshGrid = () => {
    this.setState({
      grid: [],
    });
    let grid = [];
    for (let i = 0; i < this.props.rows; i++) {
      let row: any = [];
      for (let j = 0; j < this.props.columns; j++) {
        let walls = { top: true, right: true, bottom: true, left: true };
        let cell: any = {
          visited: false,
          walls: walls,
          i: i,
          j: j,
        };
        row.push(cell);
      }
      grid.push(row);
    }
    this.setState({
      grid: grid,
    });
  };

  async componentDidMount() {
    this.makeFreshGrid()
  }

  generateMaze = async () => {
    if (this.running) return

    this.makeFreshGrid()
    await timeout(1)

    this.running = true
    let stack: any = [];

    // 1. Choose the initial cell
    let currentCell = this.state.grid[0][0];

    // 2. Mark the current cell as visited
    let newGrid = this.state.grid.slice();
    newGrid[0][0].visited = true;
    this.setState({
      grid: newGrid,
    });

    // 3. push it to the stack
    stack.push(currentCell);

    // 4. While the stack is not empty
    while (stack.length > 0) {
      // a. Pop a cell from the stack and make it a current cell
      let current = stack.pop();

      // Find neighbours
      let nbs = this.getNeighbours(current.i, current.j);

      // b. If the current cell has any neighbours which have not been visited
      if (nbs && nbs.length > 0) {
        // 1. Push the current cell to the stack
        stack.push(current);

        // 2. Choose one of the unvisited neighbours
        let currNb = _.sample(nbs);

        // 3. Remove the wall between the current cell and the chosen cell . ie current & currNb
        let [to, from] = this.getUpdatedWalls(current, currNb);

        // 4. Mark the chosen cell as visited and push it to the stack
        let newGrid = this.state.grid.slice();
        newGrid[currNb.i][currNb.j].visited = true;
        newGrid[currNb.i][currNb.j].walls = from;
        newGrid[current.i][current.j].walls = to;
        this.setState({
          grid: newGrid,
        });

        await timeout(10);
        stack.push(currNb);
      }
    }

        let nGrid = this.state.grid.slice();
        nGrid[0][0].walls =  { ...nGrid[0][0].walls, left: false };
        nGrid[24][24].walls = { ...nGrid[24][24].walls, right: false };
        this.setState({
          grid: nGrid,
        });

    this.running = false
  };

  getNeighbours = (i: any, j: any) => {
    let neighbours: any = [];

    // Left
    if (j - 1 >= 0 && !this.state.grid[i][j - 1].visited) {
      neighbours.push(this.state.grid[i][j - 1]);
    }
    // Top
    if (i - 1 >= 0 && !this.state.grid[i - 1][j].visited) {
      neighbours.push(this.state.grid[i - 1][j]);
    }
    // Right
    if (j + 1 < this.props.rows && !this.state.grid[i][j + 1].visited) {
      neighbours.push(this.state.grid[i][j + 1]);
    }
    // Down
    if (i + 1 < this.props.columns && !this.state.grid[i + 1][j].visited) {
      neighbours.push(this.state.grid[i + 1][j]);
    }

    return neighbours;
  };

  getUpdatedWalls = (fromCell: any, toCell: any) => {
    let walls = [];
    if (fromCell.j - toCell.j < 0) {
      walls.push({ ...fromCell.walls, right: false });
      walls.push({ ...toCell.walls, left: false });
    } else if (fromCell.j - toCell.j > 0) {
      walls.push({ ...fromCell.walls, left: false });
      walls.push({ ...toCell.walls, right: false });
    } else if (fromCell.i - toCell.i < 0) {
      walls.push({ ...fromCell.walls, bottom: false });
      walls.push({ ...toCell.walls, top: false });
    } else if (fromCell.i - toCell.i > 0) {
      walls.push({ ...fromCell.walls, top: false });
      walls.push({ ...toCell.walls, bottom: false });
    }
    return walls;
  };

  reGenerate = () => {
    this.makeFreshGrid();
    console.log(this.state.grid);
    this.generateMaze();
  };

  render() {
    return (
      <>
        <div className="flex flex-col">
          {this.state.grid.map((row: any) => (
            <div className="row flex" key={nanoid()}>
              {row.map((cell: any) => (
                <Cell
                  i={cell.i}
                  j={cell.j}
                  key={nanoid()}
                  visited={cell.visited}
                  walls={cell.walls}
                />
              ))}
            </div>
          ))}
        </div>

        <button onClick={this.generateMaze} className="text-green-400 focus:outline-none mt-10 p-2 border-2 rounded border-green-400 hover:bg-green-900">
          Click to Generate
        </button>
      </>
    );
  }
}
