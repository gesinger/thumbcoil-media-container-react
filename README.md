# thumbcoil-media-container-react

UNDER CONSTRUCTION

An attempt to extract and update a reusable react component for https://github.com/videojs/thumb.co.il

## Using

In your parent app, you may need to add to your webpack config:

```
  resolve: {
		...
    alias: {
      react: path.resolve('./node_modules/react'),
      "react-dom": path.resolve('./node_modules/react-dom')
    }
  },
```
