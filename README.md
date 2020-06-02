# REPLroom

A real-time coding and whiteboarding environment designed for collaborative development and remote interviewing.

## Features

REPLroom features a code sandbox where you can work with others to write and evaluate Javascript code. To facilitate collaboration, the app also includes a whiteboard space to diagram ideas, as well as text and video chat components all built into the same platform.

## Tech Stack

REPLroom utilizes Socket.IO (a library built on Web Sockets), which enables users of the application to receive changes made to a specific "room" in real time. In addition to broadcasting all changes made within a room's REPL, whiteboard, and chat components immediately, Socket.IO was also used to incorporate a series of user-friendly notifications into the app, that alert members of a room as soon as a new person enters, when someone is currently typing within the REPL, and also when someone enters a new text message into the chat window. 

The frontend design of each room was built using React, while libraries such as React-CodeMirror2, HTML Canvas and Konva, and OpenTok were used to build out the REPL, whiteboard, and video chat components respectively. When users click on the "Run" button of the application to evaluate the code they have written, the content within the REPL is converted to string and passed to a separate thread using the Web Worker API, as to not affect the functionality of the main application. 

Once the code is passed to the Web Worker, it is evaluated using the Esprima and Escodegen libraries, which both serve to parse and recompile ECMAScript using syntax trees.

### The REPL

- **CodeMirror**

Users interact with the REPL by typing code into a text editor. Both this editor, as well as the console output below it, are [CodeMirror]:https://codemirror.net/ components imported via [`react-codemirror2`]:https://github.com/scniro/react-codemirror2. Options and styles are set for each CodeMirror independently to control properties, such as syntax highlighting, line numbers, and whether the Mirror is writeable or read-only, among other things.

After a user writes their code and hits the 'Run' button, the click-handler captures the user's code currently stored on State, and passes it to a parsing function.

- **Esprima**

We expect JavaScript to be entered into our REPL, but it's still necessary to pass the user's code through a JavaScript parsing function in order to capture the outputs a user would expect from a Node terminal. In reality, everything is happening in the browser.

So, before the code can be evaluated by our Web Worker, we generate a Syntax Tree from the user's code using [Esprima]:https://esprima.org/. With the tree in hand, the parsing function looks for any expression statements the user has inputed and transforms the final statement (if not a console log) into a console log so that our Web Worker can then capture it's value in an output stream.

- **Escodegen**

Now, the parsed Syntax Tree must be transformed back into JavaScript. [Escodegen]:https://github.com/estools/escodegen accomplishes this for us. Thus, our parsing function, which takes in the user's JavaScript, also returns JavaScript.
