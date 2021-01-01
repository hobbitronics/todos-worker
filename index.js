const html = data => `
<!DOCTYPE html>
<head>
  <title>Javascript Todo List</title>
  <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-blue.min.css">
  <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
</head>

<html>
  <body>
    <div class="demo-card-wide mdl-card mdl-shadow--2dp centered">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Todo List</h2>
      </div>

      <div class="mdl-card__supporting-text">
        todo: <input id="text" type="text" placeholder="enter todo">
        <button id="add" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent btn">add</button>

        <ul id="container" class="demo-list-control mdl-list">
        </ul>
        <button id="del" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent btn">delete todos</button>
      </div>

      <div class="mdl-card__actions mdl-card--border">
        <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
          Back to my projects
        </a>
      </div>
      
      <div class="mdl-card__menu">
        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
          <i class="material-icons">share</i>
        </button>
      </div>
    </div>
  </body>
  
  <script>
  document.addEventListener('DOMContentLoaded', () => {
    let todos = ${data}
    const url = 'http://127.0.0.1:8787'
    const addBtn = document.getElementById('add')
    const text = document.getElementById('text')
    const container = document.getElementById('container')
    const delBtn = document.getElementById('del')
  
    const todoCompleted = newTodo => {
      newTodo.querySelector('#content').style = 'text-decoration: line-through'
      newTodo.id = 'checked'
      return newTodo
    }
  
    const todoMarkedIncomlplete = newTodo => {
      newTodo.querySelector('#content').style = ''
      newTodo.id = ''
      return newTodo
    }
  
    const updateTodo = async todo => {
      try {
        const response = await fetch(
          url,
          {
            method: 'PUT',
            body: JSON.stringify(todo),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          },
        )
        const data = await response.json()
        // console.log(data)
      } catch (e) {
        console.log(
          Error(
              e,
          ),
        )
      }
    }
  
    const watchBox = (box, newTodo) =>
      box.addEventListener('click', () => {
        const index = todos.findIndex(todo => todo.id == box.id)
        if (box.checked === true) {
          newTodo = todoCompleted(newTodo)
          todos[index].completed = true
        } else {
          newTodo = todoMarkedIncomlplete(newTodo)
          todos[index].completed = false
        }
        updateTodo(todos[index])
      })
  
    const renderTodos = todo => {
      let newTodo = document.createElement('li')
      const todoContent = document.createElement('span')
      const doneWrapWrap = document.createElement('span')
      const doneWrap = document.createElement('label')
      const done = document.createElement('input')
      newTodo.className = 'mdl-list__item'
      todoContent.className = 'mdl-list__item-primary-content'
      todoContent.id = 'content'
      doneWrapWrap.className = 'mdl-list__item-secondary-action'
      doneWrap.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect'
      doneWrap.for = todo.id
      done.type = 'checkbox'
      done.id = todo.id
      done.className = 'mdl-checkbox__input'
      todoContent.innerText = todo.title
      doneWrap.appendChild(done)
      doneWrapWrap.appendChild(doneWrap)
      newTodo.appendChild(todoContent)
      newTodo.appendChild(doneWrapWrap)
      if (todo.completed) {
        done.checked = true
        newTodo = todoCompleted(newTodo)
      } else {
        newTodo = todoMarkedIncomlplete(newTodo)
      }
      componentHandler.upgradeElement(newTodo)
      componentHandler.upgradeElement(todoContent)
      componentHandler.upgradeElement(doneWrapWrap)
      componentHandler.upgradeElement(doneWrap)
      componentHandler.upgradeElement(done)
      container.appendChild(newTodo)
      watchBox(done, newTodo)
    }
  
    todos.forEach(todo => renderTodos(todo))
  
    delBtn.addEventListener('click', () => {
      const checkedBoxes = document.querySelectorAll('#checked')
      checkedBoxes.forEach(checkedBox => container.removeChild(checkedBox))
      todos.forEach(todo => {
        if (todo.completed === true) {
          try {
            fetch(url, {
              method: 'DELETE',
              body: JSON.stringify(todo),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              },
            })
          } catch (e) {
            console.log(e)
          }
        }
      })
    })
  
    const addTodo = async title => {
      const newTodo = {
        id: Math.floor(Math.random() * 1000),
        title,
        completed: false,
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      const data = await response.json()
      todos.push(data)
      renderTodos(data)
      text.value = ''
    }
  
    addBtn.addEventListener('click', () => addTodo(text.value))
    text.addEventListener(
      'keydown',
      event => event.key === 'Enter' && addTodo(text.value),
    )
  })
  </script>
</html>


<style>
  body .btn {
    margin: 4px 8px;
  }

  .demo-card-wide.mdl-card {
    width: auto;
  }

  .demo-card-wide > .mdl-card__title {
    color: #fff;
    height: 176px;
    background: url('https://getmdl.io/assets/demos/welcome_card.jpg') center / cover;
  }

  .demo-card-wide > .mdl-card__menu {
    color: #fff;
  }

  body {
    padding: 20px;
    background: #fafafa;
    position: relative;
  }

  .centered {
    margin: auto;
  }

  .demo-list-control {
    width: 350px;
  }
</style>`

const defaultData = { todos: [] }

const setCache = (key, data) => TODOS.put(key, data)
const getCache = key => TODOS.get(key)
const deleteCache = (key, data) => TODOS.delete(key, data)

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function updateTodos(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const myKey = `data-${ip}`
  const body = await request.text()
  try {
    const parsed = JSON.parse(body)
    await setCache(myKey, body)
    // const index = defaultData.todos.findIndex(todo => todo.id === parsed.id)
    // if (index > -1) {
    //   defaultData.todos[index] = parsed
    // } else {
    //   defaultData.todos.push(parsed)
    // }
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
      },
    })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function getTodos(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const myKey = `data-${ip}`
  let data
  const cache = await getCache(myKey)
  if (!cache) {
    await setCache(myKey, JSON.stringify(defaultData))
    data = defaultData
  } else {
    data = JSON.parse(cache)
  }
  const body = html(
    JSON.stringify(defaultData.todos || []).replace(/</g, '\\u003c'),
  )
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

async function deleteTodos(request) {
  const ip = request.headers.get('CF-Connecting-IP')
  const myKey = `data-${ip}`
  const body = await request.text()
  try {
    const parsed = JSON.parse(body)
    deleteCache(myKey, body)
    defaultData.todos = defaultData.todos.filter(todo => todo.id !== parsed.id)
    console.log(defaultData.todos)
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
      },
    })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function handleRequest(request) {
  if (request.method == 'PUT' || request.method == 'POST') {
    return updateTodos(request)
  } else if (request.method == 'GET') {
    return getTodos(request)
  } else if (request.method == 'DELETE') {
    return deleteTodos(request)
  }
}
