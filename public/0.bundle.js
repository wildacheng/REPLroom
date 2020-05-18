;(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    /***/ './client/components/whiteboard/index.js':
      /*!***********************************************!*\
  !*** ./client/components/whiteboard/index.js ***!
  \***********************************************/
      /*! no exports provided */
      /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict'
        __webpack_require__.r(__webpack_exports__)
        /* harmony import */ var _whiteboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          /*! ./whiteboard */ './client/components/whiteboard/whiteboard.js'
        )
        // Import from the module './whiteboard':
        //   The default export, naming it draw,
        //   An export named `events`, calling it `whiteboard`.
        // Example: Draw a single stroke.
        //draw([0, 0], [250, 250], 'red', true)

        var socket = io(window.location.origin)
        socket.on('connect', function () {
          console.log("Two-way connection persistin' with server!")
        })
        socket.on('iIsDrawin', function (start, end, color) {
          Object(_whiteboard__WEBPACK_IMPORTED_MODULE_0__.draw)(
            start,
            end,
            color
          )
        })
        _whiteboard__WEBPACK_IMPORTED_MODULE_0__.default.on(
          'draw',
          function (start, end, strokeColor) {
            socket.emit('clientDraw', start, end, strokeColor)
          }
        )

        /***/
      },
  },
])
//# sourceMappingURL=0.bundle.js.map
