let id = 1
const data = {
  todos: [
    {
      id: id++,
      title: 'do thing 1',
      completed: false,
    },
    {
      id: id++,
      title: 'do thing 2',
      completed: false,
    },
    {
      id: id++,
      title: 'do thing 3',
      completed: false,
    },
  ],
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function updateTodos(request) {
  const body = await request.text()
  try {
    //await setCache(body)
    const parsed = JSON.parse(body)
    const index = data.todos.findIndex(todo => todo.id === parsed.id)
    if (index > -1) {
      data.todos[index] = parsed
    } else {
      data.todos.push(parsed)
    }
    console.log(data.todos)
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*"
      }
    })
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

async function getTodos(request) {
  const body = JSON.stringify(data.todos)
  return new Response(body, { 
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*"
    }
  })
}

async function deleteTodos(request) {
  const body = await request.text()
  try {
    const parsed = JSON.parse(body)
    data.todos = data.todos.filter(todo => todo.id !== parsed.id)
    console.log(data.todos)
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*"
      }
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
