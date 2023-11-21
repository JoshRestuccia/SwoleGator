# PASTE THE FOLLOWING AT [THIS WEBSITE](https://json-generator.com/#) 
This will generate a .json file with 20 example datapoints

```
{
  datapoints: [
    '{{repeat(20)}}',
    {
      x_data: {
        x: '{{index(0)/10}}',
        y: '{{floating(-2, 2)}}',
        l: function (tags,index) {
          return "DPx"+index;
        }
      },
      y_data: {
        x: '{{index(0)/10}}',
        y: '{{floating(-2, 2)}}',
        l: function (tags,index) {
          return "DPy"+index;
        }
      },
      z_data: {
        x: '{{index(0)/10}}',
        y: '{{floating(-2, 2)}}',
        l: function (tags,index) {
          return "DPz"+index;
        }
      }
    }
  ]
}
```