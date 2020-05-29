# REPLroom

A real-time coding and whiteboarding environment designed for collaborative development and remote interviewing.

## Features

REPLroom features a code sandbox where you can work with others to write and evaluate Javascript code. To facilitate collaboration, the app also includes a whiteboard space to diagram ideas, as well as text and video chat components all built into the same platform.

## Tech Stack

REPLroom utilizes Socket.IO (a library built on Web Sockets), which enables users of the application to receive changes made to a specific "room" in real time. In addition to broadcasting all changes made within a room's REPL, whiteboard, and chat components immediately, Socket.IO was also used to incorporate a series of user-friendly notifications into the app, that alert members of a room as soon as a new person enters, when someone is currently typing within the REPL, and also when someone enters a new text message into the chat window. The frontend design of each room was built using React, while libraries such as React-CodeMirror2, HTML Canvas and Konva, and OpenTok were used to build out the REPL, whiteboard, and video chat components respectively. When users click on the "Run" button of the application to evaluate the code they have written, the content within the REPL is converted to string and passed to a separate thread using the Web Worker API, as to not affect the functionality of the main application. Once the code is passed to the Web Worker, it is evaluated using the Esprima and Escodegen libraries, which both serve to parse and recompile ECMAScript using syntax trees.
