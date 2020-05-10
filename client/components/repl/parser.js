const esprima = require('esprima')
const escodegen = require('escodegen')

const createLog = () => ({
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      computed: false,
      object: {
        type: 'Identifier',
        name: 'console',
      },
      property: {
        type: 'Identifier',
        name: 'log',
      },
    },
    arguments: [],
  },
})

const logify = (expression) => {
  const logObj = createLog()
  logObj.expression.arguments.push(expression)
  return logObj
}

export default function parseCode(userCodeStr) {
  const syntaxTree = esprima.parseScript(userCodeStr)
  const body = syntaxTree.body
  //console.log('*** My body! ***\n', body)
  //find all the non-console expressions and turn them into logs
  for (let i = 0; i < body.length; i++) {
    if (body[i].type === 'ExpressionStatement') {
      if (body[i].expression.type === 'CallExpression') {
        let callee = body[i].expression.callee.type
        //console.log('Uhoh, its a call expression--> calleeType:', callee)
        if (callee !== 'MemberExpression') {
          body[i] = logify(body[i].expression)
          //console.log('Here new consolelog!-->\n', body[i])
        }
      } else {
        body[i] = logify(body[i].expression)
        //console.log('Here new consolelog!-->\n', body[i])
      }
    }
  }
  //console.log('*** My body NOW! ***\n', body)
  const recompiledCode = escodegen.generate(syntaxTree)
  return recompiledCode
}
