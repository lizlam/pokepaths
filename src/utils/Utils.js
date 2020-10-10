const url = "https://frozen-reef-96768.herokuapp.com/find-path";

export async function getPath(n, start, end, impassable) {
  const fetchObj = {
    "sideLength": n,
    "impassables": impassable,
    "startingLoc": {
      "x": start.x,
      "y": start.y
    },
    "endingLoc": {
      "x": end.x,
      "y": end.y
    }
  }
  console.log(fetchObj);
  const response = await fetch(url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fetchObj)
    });
  const result = await response.json();
  return result;
}

// Turns "x,y" => { "x": x, "y": y }
export const getXY = (arr) => {
  const loc = arr.split(',');
  const x = parseInt(loc[0]);
  const y = parseInt(loc[1]);
  return { "x": x, "y": y }
}