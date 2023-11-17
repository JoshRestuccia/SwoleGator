import {range, random} from "lodash";

const getData = () => {
    range(1, 25).map((i: number) => ({timestamp: i, x: random(1,25), y: random(1,25), z: random(1,25)}));
}

const getStyles = () => {
    const colors = ["red", "orange", "magenta", "gold", "blue", "purple"];
    return {
      stroke: colors[random(0, 5)],
      strokeWidth: random(1, 5),
    };
};

export {
    getData,
    getStyles
}