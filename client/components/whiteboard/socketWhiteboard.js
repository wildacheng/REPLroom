// Import from the module './whiteboard':
//   The default export, naming it draw,
//   An export named `events`, calling it `whiteboard`.
import whiteboard, {draw} from './whiteboard'

// Example: Draw a single stroke.
//draw([0, 0], [250, 250], 'red', true)
var socket = io(window.location.origin)

socket.on('connect', function () {
  console.log("Two-way connection persistin' with server!")
})

socket.on('iIsDrawin', (start, end, color) => {
  draw(start, end, color)
})

whiteboard.on('draw', function (start, end, strokeColor) {
  socket.emit('clientDraw', start, end, strokeColor)
})
